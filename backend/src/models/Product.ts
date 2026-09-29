import { Schema, model, Document, Types } from 'mongoose';

export interface IProductSpecification {
  name: string;
  value: string;
}

export interface IProductModel extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  brand: string;
  shortDescription: string;
  description: string;
  applications: string[];
  specifications: IProductSpecification[];
  availableSizes: string[];
  standards: string[];
  finishes: string[];
  images: string[];
  featured: boolean;
  isPublished: boolean;
  viewsCount: number;
}

const ProductSchema = new Schema<IProductModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
    brand: { type: String, default: 'Hariom Pipes' },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    applications: [{ type: String, trim: true }],
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    availableSizes: [{ type: String }],
    standards: [{ type: String }],
    finishes: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', shortDescription: 'text', description: 'text', applications: 'text' });
ProductSchema.index({ category: 1, isPublished: 1 });

export const Product = model<IProductModel>('Product', ProductSchema);
