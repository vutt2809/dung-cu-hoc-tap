const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const mailchimp = require('../../services/mailchimp');
const mailgun = require('../../services/mailgun');

// subscribe to newsletter api
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    const result = await mailchimp.subscribeToNewsletter(email);

    if (result.status === 'subscribed') {
      await mailgun.sendEmail(email, 'newsletter-subscription');
      res.status(200).json({
        success: true,
        message: 'You have been subscribed to the newsletter!'
      });
    } else {
      res.status(400).json({
        error: 'Something went wrong. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Newsletter subscribe error: ' + error.message
    });
  }
});

module.exports = router;
