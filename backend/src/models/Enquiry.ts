import { Schema, model, Document, Types } from 'mongoose';

export interface IEnquiryNote {
  author: string;
  text: string;
  createdAt: Date;
}

export interface IEnquiryModel extends Document {
  enquiryId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  productId?: Types.ObjectId;
  productName?: string;
  quantity?: string;
  requirementType: string;
  message: string;
  attachmentUrl?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Qualified' | 'Closed' | 'Rejected';
  notes: IEnquiryNote[];
  createdAt?: Date;
  updatedAt?: Date;
}

const EnquirySchema = new Schema<IEnquiryModel>(
  {
    enquiryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    quantity: { type: String },
    requirementType: { type: String, default: 'Quotation' },
    message: { type: String, required: true },
    attachmentUrl: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Qualified', 'Closed', 'Rejected'],
      default: 'New',
    },
    notes: [
      {
        author: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry = model<IEnquiryModel>('Enquiry', EnquirySchema);
