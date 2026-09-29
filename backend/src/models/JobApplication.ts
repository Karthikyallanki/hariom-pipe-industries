import { Schema, model, Document } from 'mongoose';

export interface IJobApplicationModel extends Document {
  applicantName: string;
  email: string;
  phone: string;
  positionApplied: string;
  experienceYears: number;
  resumeUrl: string;
  coverLetter?: string;
  status: 'Received' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';
}

const JobApplicationSchema = new Schema<IJobApplicationModel>(
  {
    applicantName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    positionApplied: { type: String, required: true, trim: true },
    experienceYears: { type: Number, required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['Received', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
      default: 'Received',
    },
  },
  { timestamps: true }
);

export const JobApplication = model<IJobApplicationModel>('JobApplication', JobApplicationSchema);
