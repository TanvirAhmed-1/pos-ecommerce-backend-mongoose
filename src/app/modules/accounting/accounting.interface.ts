import { Document, Types } from "mongoose";

export type TransactionType = "income" | "expense" | "transfer";

export type ExpenseCategory =
  | "COGS / Inventory Purchase"
  | "Marketing & Advertising"
  | "Shipping & Courier Payouts"
  | "Office Rent & Utilities"
  | "Salaries & Payroll"
  | "Packaging & Supplies"
  | "Software & Hosting"
  | "Returns & Loss"
  | "Other Expense";

export type IncomeCategory =
  | "E-Commerce Sales"
  | "POS Walk-in Sales"
  | "Delivery Fee Collected"
  | "Supplier Refund"
  | "Investment / Capital"
  | "Other Income";

export type AccountWallet =
  | "Cash in Hand"
  | "bKash Merchant"
  | "Nagad Merchant"
  | "Bank Account (BRAC)"
  | "Bank Account (City)"
  | "Payment Gateway (SSL)"
  | "Courier Receivables (Steadfast)";

export interface IAccountTransaction extends Document {
  title: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory | string;
  amount: number;
  account: AccountWallet | string;
  destinationAccount?: AccountWallet | string; // For transfers
  reference?: string; // e.g. receipt #, invoice #, order ID
  order?: Types.ObjectId;
  date: Date;
  attachment?: string;
  notes?: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
