export type IUser = {
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  role: "user" | "admin" | "superadmin";
};
