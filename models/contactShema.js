const { Schema, model } = require('mongoose')

const contactSchema = new Schema(
  {
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'user',
    // },
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
        },
    },
  
    { versionKey: false },
)

const ContactModel = model('contacts', contactSchema);

module.exports = ContactModel;