import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    // Canonical field name aligned with master plan
    mobile: {
      type: String,
      required: [true, 'Please provide a mobile number'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number'],
      maxlength: [10, 'Mobile must be 10 digits'],
    },
    college: {
      type: String,
      required: [true, 'Please provide your college name'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    events: {
      type: [String],
      required: true,
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        'You must register for at least one event',
      ],
    },
    qrCode: {
      type: String,
      required: true,
      unique: true,
    },
    checkedIn: {
      type: Boolean,
      default: false,
      index: true,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedInBy: {
      type: String,
      default: '',
    },
    confirmationSent: {
      type: Boolean,
      default: false,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    whatsappSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

RegistrationSchema.index({ mobile: 1 });
RegistrationSchema.index({ createdAt: -1 });

export default mongoose.models.Registration ||
  mongoose.model('Registration', RegistrationSchema);
