import { Schema, model, Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  order: number;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Package' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductCategory = model<IProductCategory>('ProductCategory', ProductCategorySchema);
