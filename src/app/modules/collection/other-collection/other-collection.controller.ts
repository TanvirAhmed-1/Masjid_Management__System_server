// import httpStatus from "http-status";
// import catchAsync from "../../../utils/catchAsync";
// import { otherCollectionService } from "./other-collection.services";

// const createCollection = catchAsync(async (req, res) => {
//   const data = req.body;
//   const userid = req.user?.id;
//   if (!req.user?.id) {
//     throw new Error("User not authenticated");
//   }
//   const payload = {
//     ...data,
//     userId: userid!,
//   };
//   const result = await otherCollectionService.createcollectionDB(payload);
//   res.status(httpStatus.CREATED).json({
//     success: true,
//     message: "Collection created successfully",
//     result,
//   });
// });

// const deleteDonor = catchAsync(async (req, res) => {
//   const { collectionId, donorId } = req.params;
//   const result = await otherCollectionService.deleteDonorDB(collectionId, donorId);
//   res.status(httpStatus.OK).json({
//     success: true,
//     message: "Donor deleted successfully",
//     result,
//   });
// });

// const updateDonorDB = catchAsync(async (req, res) => {
//   const { collectionId, donorId } = req.params;
//   const { amount } = req.body;
//   const result = await otherCollectionService.updateDonorDB(collectionId, donorId, amount);
//   res.status(httpStatus.OK).json({
//     success: true,
//     message: "Donor updated successfully",
//     result,
//   });
// })



// const getAllCollection = catchAsync(async (req, res) => {
//   const result = await otherCollectionService.getAllCollectionsDB();
//   res.status(httpStatus.OK).json({
//     success: true,
//     message: "Collection fetched successfully",
//     result,
//   });
// });

// const getCollectionById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await otherCollectionService.getCollectionByIdDB(id);
//   res.status(httpStatus.OK).json({
//     success: true,
//     message: "Collection fetched successfully",
//     result,
//   });
// });
// const updateCollection = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { donors } = req.body;

//   const result = await otherCollectionService.updateDonorsDB(id, donors);

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: "Collection updated successfully",
//     result,
//   });
// });

// const deleteCollection = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await otherCollectionService.deletecollectionDB(id);
//   res.status(httpStatus.OK).json({
//     success: true,
//     message: "Collection deleted successfully",
//     result,
//   });
// });
// export const otherCollectionController = {
//   createCollection,
//   getAllCollection,
//   updateCollection,
//   deleteCollection,
//   getCollectionById,
// };



import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { otherCollectionService } from "./other-collection.services";

// -------------------- Create Collection --------------------
const createCollection = catchAsync(async (req, res) => {
  if (!req.user?.id) throw new Error("User not authenticated");

  const data = req.body;
  const payload = { ...data, userId: req.user.id };
  const result = await otherCollectionService.createCollectionDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Collection created successfully",
    result,
  });
});

// -------------------- Delete Donor --------------------
const deleteDonor = catchAsync(async (req, res) => {
  const { donorId } = req.params; // collectionId not needed now
  const result = await otherCollectionService.deleteDonorDB(donorId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Donor deleted successfully",
    result,
  });
});

// -------------------- Update Donor --------------------
const updateDonor = catchAsync(async (req, res) => {
  const { donorId } = req.params;
  const { name, amount } = req.body;

  const result = await otherCollectionService.updateDonorDB(donorId, {
    name,
    amount,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Donor updated successfully",
    result,
  });
});

// -------------------- Get All Collections --------------------
const getAllCollection = catchAsync(async (req, res) => {
  const result = await otherCollectionService.getAllCollectionsDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Collections fetched successfully",
    result,
  });
});

const updateCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { donors } = req.body;

  const result = await otherCollectionService.updateColeectionDB(id, donors);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection updated successfully",
    result,
  });
});

// -------------------- Get Collection By ID --------------------
const getCollectionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await otherCollectionService.getCollectionByIdDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection fetched successfully",
    result,
  });
});

// -------------------- Delete Collection --------------------
const deleteCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await otherCollectionService.deleteCollectionDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection deleted successfully",
    result,
  });
});

export const otherCollectionController = {
  createCollection,
  getAllCollection,
  getCollectionById,
  deleteCollection,
  deleteDonor,
  updateDonor,
  updateCollection
};
  