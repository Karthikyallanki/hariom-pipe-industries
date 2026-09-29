import { Schema, model, Document } from 'mongoose';

export interface IContactMessageModel extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  message: string;
  isRead: boolean;
}

const ContactMessageSchema = new Schema<IContactMessageModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    department: { type: String, default: 'General Inquiries' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage = model<IContactMessageModel>('ContactMessage', ContactMessageSchema);
