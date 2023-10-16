const createError = require('../utils/createError');
const ERROR_TYPES = require('../constants/errors');
const ContactModel = require("./contactShema");

const listContacts = async (query, owner) => {
    const { limit = 1, page = 1, favorite } = query;

  const contactsQuery = ContactModel.find({owner})
    .skip((page - 1) * limit)
    .limit(limit)

  const countQuery = ContactModel.count({owner});
  


  if (favorite) {
    contactsQuery.where('favorite').equals(favorite);
    countQuery.where('favorite').equals(favorite);
  }


  const contacts = await contactsQuery.exec();
  const count = await countQuery.exec();

  return { contacts, count, page, limit };
};


const getContactById = async (contactId, owner) => {
  const contact = await ContactModel.findById(contactId);
  if (!contact || contact.owner.toString() !== owner.toString()) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  }
  return contact;
};

const removeContact = async (contactId) => {

  const contactToRemove = await ContactModel.findByIdAndRemove(contactId);
  
  if (!contactToRemove) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  }
  
  const newContacts = await ContactModel.find();
  return newContacts;
};

const addContact = async (body) => {
  const contact = new ContactModel(body);
  await contact.save();
  return contact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone} = body;
  if (!name && !email && !phone) {
    const error = createError(ERROR_TYPES.BAD_REQUEST, {
      message: "Missing body",
    });
    throw error;
  }


  if (!name || !email || !phone) {
  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phone) missingFields.push('phone');
  
  const error = createError(ERROR_TYPES.BAD_REQUEST, {
    message: `Missing required ${missingFields.join(', ')} field`,
  });
  throw error;
}

  const updatedContact = await ContactModel.findByIdAndUpdate(contactId, {
    $set: {
      ...body,
    }
  }, { new: true },
  );
  if (!updatedContact) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  };
  return updatedContact;
};

const updateStatusContact = async (contactId, body) => {

  const updatedContact = await ContactModel.findByIdAndUpdate(
    contactId,
    {
      $set: {
        favorite: body.favorite,
      },
    },
    { new: true }
  );

  if (!updatedContact) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  };

  return updatedContact;
};


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
