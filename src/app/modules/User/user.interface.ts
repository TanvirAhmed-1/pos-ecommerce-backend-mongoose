export type UserStatus = "active" | "inactive" | "blocked";

export type IUser = {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  role: "customer" | "reseller" | "admin" | "superadmin";
  companyName?: string;
  tradeLicense?: string;
  resellerDiscount?: number;
  status?: UserStatus;
};


