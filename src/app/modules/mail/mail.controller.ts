import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { MailService } from "./mail.services";
import AppError from "../../errors/AppError";

// POST /mail/send — send custom mail
const sendMail = catchAsync(async (req: Request, res: Response) => {
  const { to, subject, body, type } = req.body;

  if (!to || !subject || !body) {
    throw new AppError(httpStatus.BAD_REQUEST, "to, subject, and body are required");
  }

  const recipients: string[] = Array.isArray(to) ? to : [to];
  const mail = await MailService.sendMail({
    to: recipients,
    subject,
    body,
    type,
    sentBy: req.user.id,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: mail.status === "sent" ? "Email sent successfully" : "Email delivery failed but record saved",
    data: mail,
  });
});

// POST /mail/send-all — send to all active users
const sendToAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const { subject, body, type } = req.body;
  if (!subject || !body) {
    throw new AppError(httpStatus.BAD_REQUEST, "subject and body are required");
  }

  const mail = await MailService.sendToAllCustomers({
    subject, body, type: type || "newsletter", sentBy: req.user.id,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: `Broadcast email sent to ${mail.recipientCount} recipients`,
    data: mail,
  });
});

// GET /mail/all — list sent mails (paginated)
const getAllMails = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, status, type, search } = req.query;
  const result = await MailService.getAllMails({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    status: status as string,
    type: type as string,
    search: search as string,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Mails retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// GET /mail/:id — get single mail
const getMailById = catchAsync(async (req: Request, res: Response) => {
  const mail = await MailService.getMailById(req.params.id);
  if (!mail) throw new AppError(httpStatus.NOT_FOUND, "Mail not found");

  res.status(httpStatus.OK).json({ success: true, message: "Mail retrieved", data: mail });
});

// DELETE /mail/:id
const deleteMail = catchAsync(async (req: Request, res: Response) => {
  await MailService.deleteMail(req.params.id);
  res.status(httpStatus.OK).json({ success: true, message: "Mail deleted" });
});

export const MailController = {
  sendMail,
  sendToAllCustomers,
  getAllMails,
  getMailById,
  deleteMail,
};
