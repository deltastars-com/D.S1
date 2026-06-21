import { eq, and, or, desc, asc, like, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  cartItems,
  regions,
  orders,
  orderItems,
  payments,
  smsVerifications,
  notifications,
  chatMessages,
  driverAssignments,
  reviews,
  orderStatusHistory,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByPhone(phone: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PRODUCT OPERATIONS ============

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(asc(categories.displayOrder));
}

export async function getProducts(filters?: {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(products.active, true)];

  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }

  if (filters?.search) {
    const searchCondition = or(
      like(products.nameAr, `%${filters.search}%`),
      like(products.nameEn, `%${filters.search}%`)
    );
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (filters?.minPrice) {
    conditions.push(gte(products.price, filters.minPrice as any));
  }

  if (filters?.maxPrice) {
    conditions.push(lte(products.price, filters.maxPrice as any));
  }

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CART OPERATIONS ============

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({
      userId,
      productId,
      quantity,
      price: product.price,
    });
  }
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ============ REGION OPERATIONS ============

export async function getRegions() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(regions)
    .where(eq(regions.active, true))
    .orderBy(asc(regions.nameAr));
}

export async function getRegionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(regions)
    .where(eq(regions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ ORDER OPERATIONS ============

export async function createOrder(orderData: {
  userId: number;
  regionId: number;
  address: string;
  latitude?: string;
  longitude?: string;
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  paymentMethod: string;
  items: Array<{ productId: number; quantity: number; price: string }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const result = await db.insert(orders).values({
    userId: orderData.userId,
    orderNumber,
    regionId: orderData.regionId,
    address: orderData.address,
    latitude: orderData.latitude as any,
    longitude: orderData.longitude as any,
    subtotal: orderData.subtotal as any,
    tax: orderData.tax as any,
    deliveryFee: orderData.deliveryFee as any,
    total: orderData.total as any,
    paymentMethod: orderData.paymentMethod,
    status: "pending",
    paymentStatus: "pending",
  });

  const orderId = (result as any).insertId;

  // Add order items
  for (const item of orderData.items) {
    await db.insert(orderItems).values({
      orderId: orderId as number,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price as any,
      subtotal: (Number(item.price) * item.quantity).toString() as any,
    });
  }

  return orderId;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (result.length === 0) return undefined;

  const order = result[0];
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    orderId,
    status,
    notes,
  });
}

// ============ SMS VERIFICATION OPERATIONS ============

export async function createSmsVerification(phone: string, code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  await db.insert(smsVerifications).values({
    phone,
    code,
    attempts: 0,
    verified: false,
    expiresAt,
  });
}

export async function verifySmsCode(phone: string, code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(smsVerifications)
    .where(
      and(
        eq(smsVerifications.phone, phone),
        eq(smsVerifications.code, code),
        eq(smsVerifications.verified, false)
      )
    )
    .orderBy(desc(smsVerifications.createdAt))
    .limit(1);

  if (result.length === 0) return false;

  const verification = result[0];

  if (new Date() > verification.expiresAt) return false;
  if (verification.attempts >= 3) return false;

  await db
    .update(smsVerifications)
    .set({ verified: true })
    .where(eq(smsVerifications.id, verification.id));

  return true;
}

// ============ PAYMENT OPERATIONS ============

export async function createPayment(paymentData: {
  orderId: number;
  amount: string;
  method: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(payments).values({
    orderId: paymentData.orderId,
    amount: paymentData.amount as any,
    currency: "SAR",
    method: paymentData.method,
    status: "pending",
  });

  return (result as any).insertId;
}

export async function updatePaymentStatus(
  paymentId: number,
  status: "pending" | "completed" | "failed",
  transactionId?: string,
  response?: any
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(payments)
    .set({
      status,
      transactionId: transactionId || undefined,
      response: response ? JSON.stringify(response) : undefined,
    })
    .where(eq(payments.id, paymentId));
}

// ============ NOTIFICATION OPERATIONS ============

export async function createNotification(notificationData: {
  userId: number;
  title: string;
  message: string;
  type: string;
  relatedOrderId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(notifications).values(notificationData);
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

// ============ CHAT OPERATIONS ============

export async function saveChatMessage(userId: number, role: "user" | "assistant", content: string, language: string = "ar") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(chatMessages).values({
    userId,
    role,
    content,
    language,
  });
}

export async function getChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(asc(chatMessages.createdAt));
}

// ============ REVIEW OPERATIONS ============

export async function createReview(reviewData: {
  orderId: number;
  userId: number;
  productId?: number;
  rating: number;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(reviews).values(reviewData);
}

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
}
