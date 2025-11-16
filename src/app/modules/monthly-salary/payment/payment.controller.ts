// import httpStatus from "http-status";
// import catchAsync from "../../../utils/catchAsync";
// import { paymentService } from "./payment.services";

// const createPayment = catchAsync(async (req, res) => {
//   const userId = req.user!.id;
//   const payload = { ...req.body, userId };
//   const result = await paymentService.create(payload);
//   res.status(httpStatus.CREATED).json({
//     success: true,
//     statusCode: 201,
//     message: "Payment created successfully",
//     result,
//   });
// });

// const getMonthlyPayments = catchAsync(async (req, res) => {
//   const { monthKey } = req.query;
//   const result = await paymentService.getMonthlyPayments(monthKey as string);
//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: 200,
//     message: "Payment fetched successfully",
//     result,
//   });
// });

// const getMemberPaymentSummary = catchAsync(async (req, res) => {
//   const result = await paymentService.getMemberPaymentSummary(
//     req.params.memberId
//   );
//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: 200,
//     message: "Payment fetched successfully",
//     result,
//   });
// });

// const updatePayment = catchAsync(async (req, res) => {
//   const result = await paymentService.updatePaymentDB(req.params.id, req.body);
//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: 200,
//     message: "Payment updated successfully",
//     result,
//   });
// });

// const deletePayment = catchAsync(async (req, res) => {
//   const result = await paymentService.deletePaymentDB(req.params.id);
//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: 200,
//     message: "Payment deleted successfully",
//     result,
//   });
// });

// export const paymentController = {
//   createPayment,
//   getMonthlyPayments,
//   updatePayment,
//   deletePayment,
//   getMemberPaymentSummary,
// };



import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { paymentService } from "./payment.services";

const createPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const payload = { ...req.body, userId };
  
  const result = await paymentService.create(payload);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: 201,
    message: "Payment created successfully",
    data: result,
  });
});

const getMonthlyPayments = catchAsync(async (req, res) => {
  const { monthKey } = req.query;
  const userId = req.user!.id;
  
  if (!monthKey) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: 400,
      message: "monthKey is required",
    });
  }

  const result = await paymentService.getMonthlyPayments(monthKey as string, userId);
  
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Monthly payments fetched successfully",
    data: result,
  });
});

const getMemberPaymentSummary = catchAsync(async (req, res) => {
  const result = await paymentService.getMemberPaymentSummary(
    req.params.memberId
  );
  
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Member payment summary fetched successfully",
    data: result,
  });
});

const getAllMembersWithStatus = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const result = await paymentService.getAllMembersWithStatus(userId);
  
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "All members status fetched successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const result = await paymentService.updatePaymentDB(req.params.id, req.body);
  
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Payment updated successfully",
    data: result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const result = await paymentService.deletePaymentDB(req.params.id);
  
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Payment deleted successfully",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  getMonthlyPayments,
  updatePayment,
  deletePayment,
  getMemberPaymentSummary,
  getAllMembersWithStatus
};