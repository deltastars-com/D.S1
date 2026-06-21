import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PRODUCTS ROUTER ============
  products: router({
    getCategories: publicProcedure.query(async () => {
      return await db.getCategories();
    }),

    getProducts: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          search: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return await db.getProducts(input);
      }),

    getProductById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        return product;
      }),
  }),

  // ============ CART ROUTER ============
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCartItems(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.addToCart(ctx.user.id, input.productId, input.quantity);
        return { success: true };
      }),

    removeItem: protectedProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeFromCart(input.cartItemId);
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============ REGIONS ROUTER ============
  regions: router({
    getAll: publicProcedure.query(async () => {
      return await db.getRegions();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const region = await db.getRegionById(input.id);
        if (!region) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Region not found",
          });
        }
        return region;
      }),
  }),

  // ============ ORDERS ROUTER ============
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          regionId: z.number(),
          address: z.string(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          subtotal: z.string(),
          tax: z.string(),
          deliveryFee: z.string(),
          total: z.string(),
          paymentMethod: z.string(),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const orderId = await db.createOrder({
          userId: ctx.user.id,
          ...input,
        });
        return { orderId, success: true };
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }
        if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to view this order",
          });
        }
        return order;
      }),

    getUserOrders: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserOrders(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "driver") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to update order status",
          });
        }
        await db.updateOrderStatus(input.orderId, input.status, input.notes);
        return { success: true };
      }),
  }),

  // ============ SMS VERIFICATION ROUTER ============
  sms: router({
    sendCode: publicProcedure
      .input(z.object({ phone: z.string() }))
      .mutation(async ({ input }) => {
        const code = Math.random().toString().slice(2, 8);
        await db.createSmsVerification(input.phone, code);
        // TODO: Integrate with Authentica SMS service
        console.log(`SMS Code for ${input.phone}: ${code}`);
        return { success: true };
      }),

    verifyCode: publicProcedure
      .input(z.object({ phone: z.string(), code: z.string() }))
      .mutation(async ({ input }) => {
        const verified = await db.verifySmsCode(input.phone, input.code);
        if (!verified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired code",
          });
        }
        return { success: true };
      }),
  }),

  // ============ PAYMENTS ROUTER ============
  payments: router({
    create: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          amount: z.string(),
          method: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const paymentId = await db.createPayment(input);
        // TODO: Integrate with Moyasar payment gateway
        return { paymentId, success: true };
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          paymentId: z.number(),
          status: z.enum(["pending", "completed", "failed"]),
          transactionId: z.string().optional(),
          response: z.any().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to update payment status",
          });
        }
        await db.updatePaymentStatus(
          input.paymentId,
          input.status,
          input.transactionId,
          input.response
        );
        return { success: true };
      }),
  }),

  // ============ NOTIFICATIONS ROUTER ============
  notifications: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          title: z.string(),
          message: z.string(),
          type: z.string(),
          relatedOrderId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to create notifications",
          });
        }
        await db.createNotification(input);
        return { success: true };
      }),
  }),

  // ============ CHAT ROUTER ============
  chat: router({
    sendMessage: protectedProcedure
      .input(
        z.object({
          content: z.string(),
          language: z.enum(["ar", "en"]).default("ar"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.saveChatMessage(ctx.user.id, "user", input.content, input.language);
        // TODO: Integrate with Google Gemini AI
        const aiResponse = "شكراً لسؤالك! كيف يمكنني مساعدتك؟";
        await db.saveChatMessage(ctx.user.id, "assistant", aiResponse, input.language);
        return { response: aiResponse };
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return await db.getChatHistory(ctx.user.id);
    }),
  }),

  // ============ REVIEWS ROUTER ============
  reviews: router({
    create: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          productId: z.number().optional(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createReview({
          orderId: input.orderId,
          userId: ctx.user.id,
          productId: input.productId,
          rating: input.rating,
          comment: input.comment,
        });
        return { success: true };
      }),

    getProductReviews: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductReviews(input.productId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
