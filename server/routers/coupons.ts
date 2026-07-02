import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const couponsRouter = router({
  // Issue welcome coupon when user completes onboarding
  issueWelcomeCoupon: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Generate unique coupon code
        const couponCode = `WELCOME${Date.now()}${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`;

        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Return welcome coupon details
        return {
          success: true,
          message: "مبروك! حصلت على كود ترحيب حصري",
          coupon: {
            code: couponCode,
            userId: input.userId,
            type: "welcome",
            discountPercentage: 20,
            maxUses: 1,
            usedCount: 0,
            minOrderAmount: 50,
            expiresAt,
            description: "كود ترحيب حصري - 20% خصم على أول طلب",
            isActive: true,
            createdAt: new Date(),
          },
        };
      } catch (error) {
        console.error("Error in issueWelcomeCoupon:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "حدث خطأ أثناء إصدار الكوبون",
        });
      }
    }),

  // Get user's coupons
  getUserCoupons: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        // Mock data - في الإنتاج ستأتي من قاعدة البيانات
        const mockCoupons = [
          {
            code: "WELCOME123456789",
            userId: input.userId,
            type: "welcome",
            discountPercentage: 20,
            maxUses: 1,
            usedCount: 0,
            minOrderAmount: 50,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            description: "كود ترحيب حصري - 20% خصم",
            isActive: true,
          },
        ];

        return {
          success: true,
          coupons: mockCoupons,
        };
      } catch (error) {
        console.error("Error in getUserCoupons:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "حدث خطأ أثناء جلب الكوبونات",
        });
      }
    }),

  // Validate coupon
  validateCoupon: publicProcedure
    .input(z.object({ code: z.string(), orderAmount: z.number() }))
    .query(async ({ input }) => {
      try {
        // Mock validation - في الإنتاج ستتحقق من قاعدة البيانات
        if (!input.code.startsWith("WELCOME")) {
          return {
            valid: false,
            message: "كود غير صحيح أو منتهي الصلاحية",
          };
        }

        if (input.orderAmount < 50) {
          return {
            valid: false,
            message: "الحد الأدنى للطلب 50 ريال",
          };
        }

        const discountAmount = (input.orderAmount * 20) / 100;

        return {
          valid: true,
          message: "كود صحيح",
          discount: 20,
          discountAmount: Math.round(discountAmount * 100) / 100,
          finalAmount: Math.round((input.orderAmount - discountAmount) * 100) / 100,
        };
      } catch (error) {
        console.error("Error in validateCoupon:", error);
        return {
          valid: false,
          message: "حدث خطأ أثناء التحقق من الكود",
        };
      }
    }),

  // Apply coupon to order
  applyCouponToOrder: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        orderId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return {
          success: true,
          message: "تم تطبيق الكود بنجاح",
          coupon: {
            code: input.code,
            discountPercentage: 20,
          },
        };
      } catch (error) {
        console.error("Error in applyCouponToOrder:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "حدث خطأ أثناء تطبيق الكود",
        });
      }
    }),

  // Get available coupons (public)
  getAvailableCoupons: publicProcedure.query(async () => {
    try {
      // Mock data - في الإنتاج ستأتي من قاعدة البيانات
      const mockCoupons = [
        {
          code: "SUMMER50",
          type: "public",
          discountPercentage: 50,
          description: "عرض صيفي - 50% خصم",
          minOrderAmount: 100,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          code: "NEWUSER20",
          type: "public",
          discountPercentage: 20,
          description: "عرض للعملاء الجدد - 20% خصم",
          minOrderAmount: 50,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      ];

      return {
        success: true,
        coupons: mockCoupons,
      };
    } catch (error) {
      console.error("Error in getAvailableCoupons:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "حدث خطأ أثناء جلب الكوبونات",
      });
    }
  }),
});
