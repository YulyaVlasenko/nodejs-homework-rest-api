
const contactsService = require('../../../services/contacts')
const express = require('express');
const validateBody = require('../../middlewares/validateBody');
const createContactBodySchema = require('../../../schemas/contacts/createContact');
const updateContactBodySchema = require('../../../schemas/contacts/updateContact');
const updateFieldFavorite = require('../../../schemas/contacts/updateFieldFavorite');
const validateObjectId = require('../../middlewares/validateByMongoose');
// const auth = require('../../middlewares/auth');
const validateQuery = require('../../middlewares/validateQueery');
const paginationSchema = require('../../../schemas/common/pagination');
const contactFilterQueryParams = require('../../../schemas/contacts/contactFilterQueryParams');
const Joi = require('joi');

const router = express.Router()

router.get('/',
  // auth,
  validateQuery(Joi.object({ ...paginationSchema, ...contactFilterQueryParams })), async (req, res, next) => {
  const owner = req.user._id;
  const contacts = await contactsService.listContacts(req.query, owner);
  res.status(200).json(contacts);
});

router.get('/:contactId',
  // auth,
  validateObjectId, async (req, res, next) => {
  const { contactId } = req.params;
  const owner = req.user._id;
  try {
    const contact = await contactsService.getContactById(contactId, owner);
    res.status(200).json(contact);
  }catch (err) {
            next(err);
        }
})

router.post('/',
  // auth,
  validateBody(createContactBodySchema), async (req, res, next) => {
  const owner = req.user._id; 
  const body = req.body
  try {
    const contact = await contactsService.addContact({ ...body, owner });
    res.status(201).json(contact);
  }catch (err) {
            next(err);
        }
})

router.delete('/:contactId',
  // auth,
  validateObjectId, async (req, res, next) => {
  const { contactId } = req.params;
  try {
   await contactsService.removeContact(contactId);
    res.status(200).json({
      message: "contact deleted",
    });
  }catch (err) {
            next(err);
        }
})

router.put('/:contactId',
  // auth,
  validateObjectId, validateBody(updateContactBodySchema), async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  try {
    const contact = await contactsService.updateContact(contactId, body);
  res.status(200).json(contact)
  }catch (err) {
            next(err);
        }
})

router.patch('/:contactId/favorite',
  // auth,
  validateObjectId, validateBody(updateFieldFavorite), async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  try {
    const contact = await contactsService.updateStatusContact(contactId, body);
  res.status(200).json(contact)
  }catch (err) {
            next(err);
        }
});



module.exports = router
