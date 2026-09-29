import { Schema, model, Document } from 'mongoose';

export interface IFacilityModel extends Document {
  unitName: string;
  location: string;
  state: string;
  facilityType: string;
  capacityDetails: string;
  capabilities: string[];
  images: string[];
  order: number;
}

const FacilitySchema = new Schema<IFacilityModel>(
  {
    unitName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    facilityType: { type: String, required: true },
    capacityDetails: { type: String, required: true },
    capabilities: [{ type: String }],
    images: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Facility = model<IFacilityModel>('Facility', FacilitySchema);
