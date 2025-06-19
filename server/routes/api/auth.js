const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');

const auth = require('../../middleware/auth');

// Bring in Models & Helpers
const { User } = require('../../models');
const mailchimp = require('../../services/mailchimp');
const mailgun = require('../../services/mailgun');
const keys = require('../../config/keys');
const { EMAIL_PROVIDER, JWT_COOKIE } = require('../../constants');

const { secret, tokenLife } = keys.jwt;

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }

    if (user && user.provider !== EMAIL_PROVIDER.Email) {
      return res.status(400).send({
        error: `That email address is already in use using ${user.provider} provider.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Password Incorrect'
      });
    }

    const payload = {
      id: user.id
    };

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    if (!token) {
      throw new Error();
    }

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, first_name, last_name, password, isSubscribed } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'You must enter your full name.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }

    let subscribed = false;
    if (isSubscribed) {
      const result = await mailchimp.subscribeToNewsletter(email);

      if (result.status === 'subscribed') {
        subscribed = true;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const registeredUser = await User.create({
      email,
      password: hash,
      first_name,
      last_name
    });

    const payload = {
      id: registeredUser.id
    };

    await mailgun.sendEmail(
      registeredUser.email,
      'signup',
      null,
      registeredUser
    );

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    res.status(200).json({
      success: true,
      subscribed,
      token: `Bearer ${token}`,
      user: {
        id: registeredUser.id,
        first_name: registeredUser.first_name,
        last_name: registeredUser.last_name,
        email: registeredUser.email,
        role: registeredUser.role
      }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }

    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString('hex');

    await existingUser.update({
      reset_password_token: resetToken,
      reset_password_expires: Date.now() + 3600000
    });

    await mailgun.sendEmail(
      existingUser.email,
      'reset',
      req.headers.host,
      resetToken
    );

    res.status(200).json({
      success: true,
      message: 'Please check your email for the link to reset your password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/reset/:token', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const resetUser = await User.findOne({
      reset_password_token: req.params.token,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!resetUser) {
      return res.status(400).json({
        error:
          'Your token has expired. Please attempt to reset your password again.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    resetUser.password = hash;
    resetUser.reset_password_token = undefined;
    resetUser.reset_password_expires = undefined;

    resetUser.save();

    await mailgun.sendEmail(resetUser.email, 'reset-confirmation');

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/reset', auth, async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const email = req.user.email;

    if (!email) {
      return res.status(401).send('Unauthenticated');
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: 'Please enter your correct old password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(confirmPassword, salt);
    existingUser.password = hash;
    existingUser.save();

    await mailgun.sendEmail(existingUser.email, 'reset-confirmation');

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force'
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${keys.app.clientURL}/login`,
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    // TODO find another way to send the token to frontend
    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
    const jwtToken = `Bearer ${token}`;
    res.redirect(`${keys.app.clientURL}/auth/success?token=${jwtToken}`);
  }
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['public_profile', 'email']
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${keys.app.clientURL}/login`,
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };
    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
    const jwtToken = `Bearer ${token}`;
    res.redirect(`${keys.app.clientURL}/auth/success?token=${jwtToken}`);
  }
);

module.exports = router;
