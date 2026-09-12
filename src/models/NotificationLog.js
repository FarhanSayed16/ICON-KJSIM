import mongoose from 'mongoose';

const NotificationLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp'],
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending', 'skipped'],
      default: 'pending',
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      default: null,
    },
    isBroadcast: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

NotificationLogSchema.index({ type: 1, sentAt: -1 });
NotificationLogSchema.index({ registrationId: 1 });

export default mongoose.models.NotificationLog ||
  mongoose.model('NotificationLog', NotificationLogSchema);
