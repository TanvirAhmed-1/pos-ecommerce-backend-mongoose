import nodemailer from "nodemailer";
import { MailModel } from "./mail.model";
import { UserModel } from "../user/user.model";

// ── SMTP Transporter ──────────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ── Send Email ────────────────────────────────────────────────────────────────
interface SendMailParams {
  to: string[];
  subject: string;
  body: string;
  type?: "custom" | "newsletter" | "notification" | "order" | "system";
  sentBy: string;
}

const sendMail = async (params: SendMailParams) => {
  const { to, subject, body, type = "custom", sentBy } = params;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@zenithcommerce.io";

  let status: "sent" | "failed" = "sent";
  let errorMessage: string | undefined;

  // Attempt to send via SMTP
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Zenith Commerce" <${fromAddress}>`,
      to: to.join(", "),
      subject,
      html: body,
    });
  } catch (err: any) {
    status = "failed";
    errorMessage = err?.message || "SMTP send error";
  }

  // Always persist to DB regardless of SMTP result
  const mail = await MailModel.create({
    from: fromAddress,
    to,
    subject,
    body,
    type,
    status,
    sentBy,
    errorMessage,
    recipientCount: to.length,
  });

  return mail;
};

// ── Send to all customers ─────────────────────────────────────────────────────
const sendToAllCustomers = async (params: Omit<SendMailParams, "to">) => {
  const customers = await UserModel.find({ status: "active" }).select("email");
  const emails = customers.map((u) => u.email);
  return sendMail({ ...params, to: emails });
};

// ── Get all mails (paginated) ─────────────────────────────────────────────────
interface GetMailsParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
}

const getAllMails = async (params: GetMailsParams = {}) => {
  const { page = 1, limit = 20, status, type, search } = params;
  const query: Record<string, any> = {};

  if (status && status !== "all") query.status = status;
  if (type && type !== "all") query.type = type;
  if (search) query.subject = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await MailModel.countDocuments(query);

  const mails = await MailModel.find(query)
    .populate("sentBy", "name email")
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  return {
    data: mails,
    meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ── Get single mail ───────────────────────────────────────────────────────────
const getMailById = async (id: string) => {
  return MailModel.findById(id).populate("sentBy", "name email");
};

// ── Delete mail record ────────────────────────────────────────────────────────
const deleteMail = async (id: string) => {
  return MailModel.findByIdAndDelete(id);
};

export const MailService = {
  sendMail,
  sendToAllCustomers,
  getAllMails,
  getMailById,
  deleteMail,
};
