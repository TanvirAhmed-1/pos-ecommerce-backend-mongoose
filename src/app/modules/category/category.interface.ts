import { Types } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  level: number;
  title?: string;
  image?: string;
  parentCategory?: Types.ObjectId;
  ancestors: Types.ObjectId[];
  isActive: boolean;
  showInFooter: boolean;
  showInNavbar: boolean;
  isFeatured?: boolean;
}