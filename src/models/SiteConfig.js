import mongoose from 'mongoose';

const PaymentQrSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    label: { type: String, default: '' },
    qrImageUrl: { type: String, default: '' },
    payUrl: { type: String, default: '' },
  },
  { _id: false }
);

const SiteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    edition: { type: String, default: '2026' },
    name: { type: String, default: 'ICON 2026' },
    theme: { type: String, default: '' },
    slogan: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    institution: { type: String, default: '' },
    university: { type: String, default: '' },
    eventDates: {
      start: { type: String, default: '' },
      end: { type: String, default: '' },
    },
    countdownTarget: { type: String, default: '' },
    venue: {
      name: { type: String, default: '' },
      address: { type: String, default: '' },
      mapsQuery: { type: String, default: '' },
      mapsEmbed: { type: String, default: '' },
    },
    contacts: {
      type: [{ name: String, phone: String }],
      default: [],
    },
    email: { type: String, default: '' },
    socials: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    stats: {
      participants: { type: Number, default: 0 },
      events: { type: Number, default: 0 },
      prizePool: { type: Number, default: 0 },
      colleges: { type: Number, default: 0 },
    },
    registrationOpen: { type: Boolean, default: true },
    paymentQrs: { type: [PaymentQrSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig ||
  mongoose.model('SiteConfig', SiteConfigSchema);
