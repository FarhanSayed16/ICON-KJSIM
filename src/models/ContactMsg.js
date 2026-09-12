import mongoose from 'mongoose';

const ContactMsgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in dev environment
export default mongoose.models.ContactMsg || mongoose.model('ContactMsg', ContactMsgSchema);
