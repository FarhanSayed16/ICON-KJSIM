import mongoose from 'mongoose';

const PocSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug'],
    },
    edition: { type: String, default: '2026', index: true },
    category: {
      type: String,
      enum: ['technical', 'sports', 'gaming', 'mini-games', 'non-technical'],
      required: true,
    },
    shortDesc: { type: String, default: '', maxlength: 300 },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    venue: { type: String, default: '' },
    registrationFee: { type: Number, default: 0, min: 0 },
    prizePool: { type: Number, default: 0, min: 0 },
    teamSize: { type: String, default: 'Solo' },
    maxParticipants: { type: Number, default: null },
    posterImage: { type: String, default: '' },
    rules: { type: [String], default: [] },
    /** Nested titles under a category item (e.g. Gaming → Clash Royale) */
    includes: { type: [String], default: [] },
    poc: { type: PocSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true, index: true },
    isRegistrationOpen: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    streamUrl: { type: String, default: null },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSchema.index({ edition: 1, slug: 1 }, { unique: true });
EventSchema.index({ edition: 1, isActive: 1, sortOrder: 1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
