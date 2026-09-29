import { Schema, model, Document } from 'mongoose';

export interface IDealerEnquiryModel extends Document {
  enquiryId: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  businessType: string;
  productInterest: string[];
  existingBusinessDetails: string;
  message: string;
  status: 'New' | 'Under Review' | 'Contacted' | 'Approved' | 'Rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const DealerEnquirySchema = new Schema<IDealerEnquiryModel>(
  {
    enquiryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    businessType: { type: String, required: true },
    productInterest: [{ type: String }],
    existingBusinessDetails: { type: String, default: '' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Under Review', 'Contacted', 'Approved', 'Rejected'],
      default: 'New',
    },
  },
  { timestamps: true }
);

DealerEnquirySchema.index({ status: 1, createdAt: -1 });

export const DealerEnquiry = model<IDealerEnquiryModel>('DealerEnquiry', DealerEnquirySchema);
