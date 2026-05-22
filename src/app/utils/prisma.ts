import { PrismaClient } from "@prisma/client";

const basePrisma = new PrismaClient();

// Centralized cache invalidation extension to automatically keep the Redis Dashboard and Member Caches 100% real-time on any database mutations
const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        const mutatingActions = ["create", "update", "delete", "createMany", "updateMany", "deleteMany"];
        const targetModels = [
          "Payment",
          "FridayCollection",
          "SalaryPayment",
          "MemberAccessoryPurchase",
          "Member",
          "Staff",
          "OtherCollection",
          "OtherCollectionName",
        ];

        if (targetModels.includes(model) && mutatingActions.includes(operation)) {
          let mosqueId = (args as any)?.data?.mosqueId || (args as any)?.where?.mosqueId;

          if (!mosqueId && result) {
            if (Array.isArray(result)) {
              mosqueId = (result as any)[0]?.mosqueId;
            } else {
              mosqueId = (result as any).mosqueId;
            }
          }

          if (mosqueId) {
            const { invalidateDashboardCache } = require("./cache.util");
            invalidateDashboardCache(mosqueId).catch((err: any) =>
              console.error("Prisma Extension Cache Invalidation Error:", err)
            );
          }
        }

        return result;
      },
    },
  },
});

export default prisma;
