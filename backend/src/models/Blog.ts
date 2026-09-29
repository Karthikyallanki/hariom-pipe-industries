import { Schema, model, Document } from 'mongoose';

export interface IBlogModel extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readTimeMinutes: number;
  isPublished: boolean;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
}

const BlogSchema = new Schema<IBlogModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Hariom Pipes Media Team' },
    category: { type: String, default: 'Industry Insights' },
    tags: [{ type: String }],
    coverImage: { type: String },
    readTimeMinutes: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });

export const Blog = model<IBlogModel>('Blog', BlogSchema);
