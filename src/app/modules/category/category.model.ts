import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    level: { type: Number, default: 0 },
    title: { type: String, trim: true },
    image: { type: String, trim: true },
    parentCategory: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      default: null 
    },
    ancestors: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Category' 
    }],
    isActive: { type: Boolean, default: true },
    showInFooter: { type: Boolean, default: false },
    showInNavbar: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexing for faster search
categorySchema.index({ level: 1 });

export const CategoryModel = model<ICategory>('Category', categorySchema);