import { Schema, model, Document } from 'mongoose';

export interface IDownloadModel extends Document {
  title: string;
  category: 'Brochure' | 'Product Catalogue' | 'Technical Datasheet' | 'Certificate' | 'Annual Report' | 'Financial Disclosure';
  financialYear?: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  isPublic: boolean;
}

const DownloadSchema = new Schema<IDownloadModel>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Brochure', 'Product Catalogue', 'Technical Datasheet', 'Certificate', 'Annual Report', 'Financial Disclosure'],
      required: true,
    },
    financialYear: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: 'PDF' },
    fileSize: { type: String, default: '2.5 MB' },
    downloadCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DownloadSchema.index({ category: 1, isPublic: 1 });

export const Download = model<IDownloadModel>('Download', DownloadSchema);
