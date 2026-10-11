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
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
      trim: true,
      index: true,
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
    /** Single event this registration is for (one payment / one QR per reg). */
    eventSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    /** Kept as [eventSlug] for admin filters / CSV compatibility. */
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
    edition: {
      type: String,
      default: '2026',
      index: true,
    },
    payableAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentScreenshotUrl: {
      type: String,
      default: '',
    },
    paymentTxnId: {
      type: String,
      default: '',
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'not_required'],
      default: 'pending',
      index: true,
    },
    paymentVerifiedAt: {
      type: Date,
      default: null,
    },
    paymentVerifiedBy: {
      type: String,
      default: '',
    },
    paymentNote: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

RegistrationSchema.pre('validate', function syncEventFields(next) {
  if (!this.eventSlug && this.events?.[0]) {
    this.eventSlug = this.events[0];
  }
  if (this.eventSlug) {
    this.events = [this.eventSlug];
  }
  next();
});

RegistrationSchema.index({ mobile: 1 });
RegistrationSchema.index({ createdAt: -1 });
// Same person may register for multiple events — but only once per event
RegistrationSchema.index(
  { email: 1, eventSlug: 1, edition: 1 },
  { unique: true }
);
RegistrationSchema.index(
  { paymentTxnId: 1 },
  {
    unique: true,
    partialFilterExpression: { paymentTxnId: { $type: 'string', $gt: '' } },
  }
);

// Hot-reload can keep a stale schema (e.g. old unique email). Prefer fresh model in dev.
if (mongoose.models.Registration) {
  delete mongoose.models.Registration;
}

export default mongoose.model('Registration', RegistrationSchema);
