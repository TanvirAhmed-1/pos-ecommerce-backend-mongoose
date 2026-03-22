import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    level: { type: Number, default: 0 },
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
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexing for faster search
categorySchema.index({ slug: 1 });
categorySchema.index({ level: 1 });

export const CategoryModel = model<ICategory>('Category', categorySchema);