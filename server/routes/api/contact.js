const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Contact } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// add contact api
router.post('/add', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'You must enter a name.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    if (!message) {
      return res.status(400).json({ error: 'You must enter a message.' });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
      is_read: false
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
      contact
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch contacts api
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      contacts
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch contact api
router.get('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const contactId = req.params.id;

    const contactDoc = await Contact.findByPk(contactId);

    if (!contactDoc) {
      return res.status(404).json({
        message: 'No contact found.'
      });
    }

    res.status(200).json({
      contact: contactDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// mark contact as read api
router.put('/:id/read', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const contactId = req.params.id;

    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({
        message: 'No contact found.'
      });
    }

    await contact.update({ is_read: true });

    res.status(200).json({
      success: true,
      message: 'Contact has been marked as read!',
      contact
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// delete contact api
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: 'No contact found.'
      });
    }

    await contact.destroy();

    res.status(200).json({
      success: true,
      message: 'Contact has been deleted successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
