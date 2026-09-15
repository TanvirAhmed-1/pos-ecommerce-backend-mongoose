import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AccountingService } from "./accounting.services";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await AccountingService.createTransaction(userId, req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Transaction entry created successfully",
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountingService.getAllTransactions(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Accounting transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAccountingSummary = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const result = await AccountingService.getAccountingSummary({
    startDate: startDate as string,
    endDate: endDate as string,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Accounting summary retrieved successfully",
    data: result,
  });
});



const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AccountingService.updateTransaction(id, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Transaction updated successfully",
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AccountingService.deleteTransaction(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Transaction deleted successfully",
    data: result,
  });
});

export const AccountingController = {
  createTransaction,
  getAllTransactions,
  getAccountingSummary,
  updateTransaction,
  deleteTransaction,
};
