import { Types } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  level: number;
  parentCategory?: Types.ObjectId;
  ancestors: Types.ObjectId[];
  isActive: boolean;
  showInFooter: boolean;
  showInNavbar: boolean;
}