import {
  users, tutorialSteps, userProgress, subscribers, products, orders, spots, games, gameTurns,
  type User, type UpsertUser, type TutorialStep, type InsertTutorialStep,
  type UserProgress, type InsertUserProgress, type UpdateUserProgress, type Subscriber,
  type Product, type InsertProduct, type Order, type InsertOrder, type Spot, type InsertSpot,
  type Game, type InsertGame, type GameTurn, type InsertGameTurn
} from "../shared/schema.ts";
import { CreateSubscriber } from "./storage/types.ts";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "../shared/schema.ts";

export interface IStorage {
  // User methods for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserOnboardingStatus(userId: string, completed: boolean, currentStep?: number): Promise<User | undefined>;

  // Tutorial steps methods
  getAllTutorialSteps(): Promise<TutorialStep[]>;
  getTutorialStep(id: number): Promise<TutorialStep | undefined>;
  createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserStepProgress(userId: string, stepId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: string, stepId: number, updates: UpdateUserProgress): Promise<UserProgress | undefined>;

  // Subscriber methods
  createSubscriber(data: CreateSubscriber): Promise<Subscriber>;
  getSubscribers(): Promise<Subscriber[]>;
  getSubscriber(email: string): Promise<Subscriber | undefined>;

  // Donation methods
  createDonation(donation: {
    firstName: string;
    amount: number;
    paymentIntentId: string;
    status: string;
  }): Promise<any>;
  updateDonationStatus(paymentIntentId: string, status: string): Promise<any>;
  getRecentDonors(limit?: number): Promise<{ firstName: string; createdAt: Date }[]>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(productId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Spot methods
  getAllSpots(): Promise<Spot[]>;
  getSpot(spotId: string): Promise<Spot | undefined>;
  createSpot(spot: InsertSpot): Promise<Spot>;

  // Game methods
  getAllGames(): Promise<Game[]>;
  getGame(gameId: string): Promise<Game | undefined>;
  getGamesByPlayer(playerId: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  joinGame(gameId: string, player2Id: string, player2Name: string): Promise<Game | undefined>;
  updateGame(gameId: string, updates: Partial<Game>): Promise<Game | undefined>;
  submitTrick(gameId: string, playerId: string, playerName: string, trick: string): Promise<{ game: Game; turnAdded: boolean }>;
  
  // Game turn methods
  getGameTurns(gameId: string): Promise<GameTurn[]>;
  createGameTurn(turn: InsertGameTurn): Promise<GameTurn>;
}

/**
 * Database storage implementation for SkateHubba
 * 
 * Provides data access layer for all application entities including:
 * - Users and authentication
 * - Tutorial steps and progress
 * - Subscribers
 * - Donations
 * - Products and orders
 * - Skate spots
 * - S.K.A.T.E. games
 * 
 * Uses Drizzle ORM for type-safe database operations
 */
export class DatabaseStorage implements IStorage {
  // Use a private property to hold the db instance if needed for multiple methods,
  // or directly use the imported `db` as done in the original code.
  // For consistency with the original code's approach, we'll assume `db` is used directly.

  constructor() {
    // Only initialize tutorial steps if database is available
    if (db) {
      this.initializeDefaultTutorialSteps();
    } else {
      console.log('Database not available, skipping tutorial steps initialization');
    }
  }

  private async initializeDefaultTutorialSteps() {
    if (!db) return;

    try {
      // Test database connection first
      const testQuery = await db.select().from(tutorialSteps).limit(1);

      // Check if tutorial steps already exist
      if (testQuery.length > 0) {
        console.log('Tutorial steps already initialized');
        return;
      }

      console.log('Initializing default tutorial steps...');

      // Initialize with default steps
      const defaultSteps: InsertTutorialStep[] = [
        {
          title: "Welcome to SkateHubba",
          description: "Learn the basics of navigating the skate community",
          type: "intro",
          content: {
            videoUrl: "https://example.com/intro-video"
          },
          order: 1
        },
        {
          title: "Interactive Elements",
          description: "Try tapping, swiping, and dragging elements",
          type: "interactive",
          content: {
            interactiveElements: [
              {
                type: "tap",
                target: "skate-board",
                instruction: "Tap the skateboard to pick it up"
              },
              {
                type: "swipe",
                target: "trick-menu",
                instruction: "Swipe to browse tricks"
              }
            ]
          },
          order: 2
        },
        {
          title: "Community Challenge",
          description: "Complete your first community challenge",
          type: "challenge",
          content: {
            challengeData: {
              action: "post_trick",
              expectedResult: "Share a trick with the community"
            }
          },
          order: 3
        }
      ];

      for (const step of defaultSteps) {
        await this.createTutorialStep(step);
      }

      console.log('Successfully initialized tutorial steps');
    } catch (error) {
      console.error('Database initialization failed - continuing without default tutorial steps:', error);
      // Don't throw error to prevent crash loop - app can still function
    }
  }

  // User methods for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserOnboardingStatus(userId: string, completed: boolean, currentStep?: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        onboardingCompleted: completed,
        currentTutorialStep: currentStep,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  // Tutorial steps methods
  async getAllTutorialSteps(): Promise<TutorialStep[]> {
    return await db
      .select()
      .from(tutorialSteps)
      .where(eq(tutorialSteps.isActive, true))
      .orderBy(tutorialSteps.order);
  }

  async getTutorialStep(id: number): Promise<TutorialStep | undefined> {
    const [step] = await db.select().from(tutorialSteps).where(eq(tutorialSteps.id, id));
    return step || undefined;
  }

  async createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep> {
    const [createdStep] = await db
      .insert(tutorialSteps)
      .values(step as any)
      .returning();
    return createdStep;
  }

  // User progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(userProgress.stepId);
  }

  async getUserStepProgress(userId: string, stepId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.stepId, stepId)));
    return progress || undefined;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [createdProgress] = await db
      .insert(userProgress)
      .values(progress as any)
      .returning();
    return createdProgress;
  }

  async updateUserProgress(userId: string, stepId: number, updates: UpdateUserProgress): Promise<UserProgress | undefined> {
    const updateData: any = {
      ...updates,
      completedAt: updates.completed ? new Date() : undefined
    };

    const [updatedProgress] = await db
      .update(userProgress)
      .set(updateData)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.stepId, stepId)))
      .returning();
    return updatedProgress || undefined;
  }

  // Subscriber methods
  async createSubscriber(data: CreateSubscriber): Promise<Subscriber> {
    const now = new Date();
    const [subscriber] = await db
      .insert(subscribers)
      .values({
        email: data.email,
        firstName: data.firstName,
        isActive: data.isActive ?? true,
        createdAt: now,
      })
      .returning();
    return subscriber;
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.isActive, true));
  }

  async getSubscriber(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber || undefined;
  }

  // Donation methods
  async createDonation(donation: {
    firstName: string;
    amount: number;
    paymentIntentId: string;
    status: string;
  }) {
    const [newDonation] = await db
      .insert(schema.donations)
      .values(donation)
      .returning();
    return newDonation;
  }

  async updateDonationStatus(paymentIntentId: string, status: string) {
    const [updatedDonation] = await db
      .update(schema.donations)
      .set({ status })
      .where(eq(schema.donations.paymentIntentId, paymentIntentId))
      .returning();
    return updatedDonation;
  }

  async getRecentDonors(limit: number = 10): Promise<{ firstName: string; createdAt: Date }[]> {
    return await db
      .select({
        firstName: schema.donations.firstName,
        createdAt: schema.donations.createdAt
      })
      .from(schema.donations)
      .where(eq(schema.donations.status, "succeeded"))
      .orderBy(desc(schema.donations.createdAt))
      .limit(limit);
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(products.id);
  }

  async getProduct(productId: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.productId, productId));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product as any)
      .returning();
    return newProduct;
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order as any)
      .returning();
    return newOrder;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    }
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order || undefined;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  // Spot methods
  async getAllSpots(): Promise<Spot[]> {
    return await db
      .select()
      .from(spots)
      .orderBy(spots.id);
  }

  async getSpot(spotId: string): Promise<Spot | undefined> {
    const [spot] = await db
      .select()
      .from(spots)
      .where(eq(spots.id, spotId));
    return spot || undefined;
  }

  async createSpot(spot: InsertSpot): Promise<Spot> {
    const [newSpot] = await db
      .insert(spots)
      .values(spot as any)
      .returning();
    return newSpot;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return await db
      .select()
      .from(games)
      .orderBy(desc(games.createdAt));
  }

  async getGame(gameId: string): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId));
    return game || undefined;
  }

  async getGamesByPlayer(playerId: string): Promise<Game[]> {
    const { or } = await import('drizzle-orm');
    return await db
      .select()
      .from(games)
      .where(
        or(
          eq(games.player1Id, playerId),
          eq(games.player2Id, playerId)
        )
      )
      .orderBy(desc(games.createdAt));
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db
      .insert(games)
      .values(game as any)
      .returning();
    return newGame;
  }

  async joinGame(gameId: string, player2Id: string, player2Name: string): Promise<Game | undefined> {
    const [updatedGame] = await db
      .update(games)
      .set({
        player2Id,
        player2Name,
        status: 'active',
        currentTurn: player2Id, // Player 2 starts first turn
        updatedAt: new Date(),
      })
      .where(and(eq(games.id, gameId), eq(games.status, 'waiting')))
      .returning();
    return updatedGame || undefined;
  }

  async updateGame(gameId: string, updates: Partial<Game>): Promise<Game | undefined> {
    const [updatedGame] = await db
      .update(games)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(games.id, gameId))
      .returning();
    return updatedGame || undefined;
  }

  async submitTrick(gameId: string, playerId: string, playerName: string, trick: string): Promise<{ game: Game; turnAdded: boolean }> {
    // Get current game state
    const game = await this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Validate it's the player's turn
    if (game.currentTurn !== playerId) {
      throw new Error('Not your turn');
    }

    // Get current turn number
    const turns = await this.getGameTurns(gameId);
    const turnNumber = turns.length + 1;

    // Create turn record
    await this.createGameTurn({
      gameId,
      playerId,
      playerName,
      turnNumber,
      trickDescription: trick,
      result: 'landed',
    });

    // Determine next turn and update game state
    const opponentId = game.player1Id === playerId ? game.player2Id : game.player1Id;
    
    const updatedGame = await this.updateGame(gameId, {
      currentTurn: opponentId || undefined,
      lastTrickDescription: trick,
      lastTrickBy: playerId,
    });

    return {
      game: updatedGame || game,
      turnAdded: true,
    };
  }

  // Game turn methods
  async getGameTurns(gameId: string): Promise<GameTurn[]> {
    return await db
      .select()
      .from(gameTurns)
      .where(eq(gameTurns.gameId, gameId))
      .orderBy(gameTurns.turnNumber);
  }

  async createGameTurn(turn: InsertGameTurn): Promise<GameTurn> {
    const [newTurn] = await db
      .insert(gameTurns)
      .values(turn as any)
      .returning();
    return newTurn;
  }
}

class MockStorage implements IStorage {
  // Mock implementations that don't use database
  async getUser(id: string): Promise<User | undefined> {
    console.log(`MockStorage: getUser(${id}) - returning undefined`);
    return undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    console.log(`MockStorage: upsertUser - returning mock user`);
    return {
      id: user.id,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImageUrl: null,
      onboardingCompleted: false,
      currentTutorialStep: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }

  async updateUserOnboardingStatus(userId: string, completed: boolean, currentStep?: number): Promise<User | undefined> {
    console.log(`MockStorage: updateUserOnboardingStatus(${userId}, ${completed})`);
    return undefined;
  }

  async getAllTutorialSteps(): Promise<TutorialStep[]> {
    console.log(`MockStorage: getAllTutorialSteps - returning empty array`);
    return [];
  }

  async getTutorialStep(id: number): Promise<TutorialStep | undefined> {
    console.log(`MockStorage: getTutorialStep(${id}) - returning undefined`);
    return undefined;
  }

  async createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep> {
    console.log(`MockStorage: createTutorialStep - returning mock step`);
    return {
      id: 1,
      title: step.title,
      description: step.description || '',
      type: step.type,
      content: step.content,
      order: step.order,
      isActive: step.isActive,
    } as TutorialStep;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    console.log(`MockStorage: getUserProgress(${userId}) - returning empty array`);
    return [];
  }

  async getUserStepProgress(userId: string, stepId: number): Promise<UserProgress | undefined> {
    console.log(`MockStorage: getUserStepProgress(${userId}, ${stepId}) - returning undefined`);
    return undefined;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    console.log(`MockStorage: createUserProgress - returning mock progress`);
    return {
      id: 1,
      userId: progress.userId,
      stepId: progress.stepId,
      completed: progress.completed,
      completedAt: null,
      timeSpent: null,
      interactionData: null,
    } as UserProgress;
  }

  async updateUserProgress(userId: string, stepId: number, updates: UpdateUserProgress): Promise<UserProgress | undefined> {
    console.log(`MockStorage: updateUserProgress(${userId}, ${stepId}) - returning undefined`);
    return undefined;
  }

  async createSubscriber(data: CreateSubscriber): Promise<Subscriber> {
    console.log(`MockStorage: createSubscriber - returning mock subscriber`);
    return {
      id: 1,
      email: data.email,
      firstName: data.firstName,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
    } as Subscriber;
  }

  async getSubscribers(): Promise<Subscriber[]> {
    console.log(`MockStorage: getSubscribers - returning empty array`);
    return [];
  }

  async getSubscriber(email: string): Promise<Subscriber | undefined> {
    console.log(`MockStorage: getSubscriber(${email}) - returning undefined`);
    return undefined;
  }

  async createDonation(donation: { firstName: string; amount: number; paymentIntentId: string; status: string; }) {
    console.log(`MockStorage: createDonation - returning mock donation`);
    return { id: 1, ...donation, createdAt: new Date() };
  }

  async updateDonationStatus(paymentIntentId: string, status: string) {
    console.log(`MockStorage: updateDonationStatus(${paymentIntentId}, ${status})`);
    return undefined;
  }

  async getRecentDonors(limit: number = 10): Promise<{ firstName: string; createdAt: Date }[]> {
    console.log(`MockStorage: getRecentDonors(${limit}) - returning empty array`);
    return [];
  }

  async getAllProducts(): Promise<Product[]> {
    console.log(`MockStorage: getAllProducts - returning empty array`);
    return [];
  }

  async getProduct(productId: string): Promise<Product | undefined> {
    console.log(`MockStorage: getProduct(${productId}) - returning undefined`);
    return undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    console.log(`MockStorage: createProduct - returning mock product`);
    return {
      id: 1,
      name: product.name,
      description: product.description || '',
      price: product.price,
      productId: product.productId || 'mock',
      imageUrl: product.imageUrl,
      icon: product.icon,
      category: product.category,
      isActive: product.isActive,
      createdAt: new Date(),
    } as Product;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    console.log(`MockStorage: createOrder - returning mock order`);
    return {
      id: 1,
      userId: order.userId,
      userEmail: order.userEmail,
      items: order.items,
      total: order.total,
      status: order.status,
      paymentIntentId: order.paymentIntentId,
      createdAt: new Date(),
    } as Order;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    console.log(`MockStorage: getOrders(${userId}) - returning empty array`);
    return [];
  }

  async getOrder(id: number): Promise<Order | undefined> {
    console.log(`MockStorage: getOrder(${id}) - returning undefined`);
    return undefined;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    console.log(`MockStorage: updateOrderStatus(${id}, ${status}) - returning undefined`);
    return undefined;
  }

  async getAllSpots(): Promise<Spot[]> {
    console.log(`MockStorage: getAllSpots - returning empty array`);
    return [];
  }

  async getSpot(spotId: string): Promise<Spot | undefined> {
    console.log(`MockStorage: getSpot(${spotId}) - returning undefined`);
    return undefined;
  }

  async createSpot(spot: InsertSpot): Promise<Spot> {
    console.log(`MockStorage: createSpot - returning mock spot`);
    return {
      id: 'mock',
      name: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      address: spot.address || null,
      description: spot.description || null,
      tags: spot.tags || null,
      tier: spot.tier || null,
      checkinCount: spot.checkinCount || null,
      totalVisitors: spot.totalVisitors || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Spot;
  }

  async getAllGames(): Promise<Game[]> {
    console.log(`MockStorage: getAllGames - returning empty array`);
    return [];
  }

  async getGame(gameId: string): Promise<Game | undefined> {
    console.log(`MockStorage: getGame(${gameId}) - returning undefined`);
    return undefined;
  }

  async getGamesByPlayer(playerId: string): Promise<Game[]> {
    console.log(`MockStorage: getGamesByPlayer(${playerId}) - returning empty array`);
    return [];
  }

  async createGame(game: InsertGame): Promise<Game> {
    console.log(`MockStorage: createGame - returning mock game`);
    return {
      id: 'mock',
      player1Id: game.player1Id,
      player1Name: game.player1Name,
      player2Id: game.player2Id || null,
      player2Name: game.player2Name || null,
      status: game.status || 'waiting',
      currentTurn: game.currentTurn || null,
      winnerId: game.winnerId || null,
      winnerName: null,
      lastTrickDescription: game.lastTrickDescription || null,
      lastTrickBy: game.lastTrickBy || null,
      player1Letters: '',
      player2Letters: '',
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Game;
  }

  async joinGame(gameId: string, player2Id: string, player2Name: string): Promise<Game | undefined> {
    console.log(`MockStorage: joinGame(${gameId}, ${player2Id}) - returning undefined`);
    return undefined;
  }

  async updateGame(gameId: string, updates: Partial<Game>): Promise<Game | undefined> {
    console.log(`MockStorage: updateGame(${gameId}) - returning undefined`);
    return undefined;
  }

  async submitTrick(gameId: string, playerId: string, playerName: string, trick: string): Promise<{ game: Game; turnAdded: boolean }> {
    console.log(`MockStorage: submitTrick(${gameId}, ${playerId}) - throwing error`);
    throw new Error('Database not available');
  }

  async getGameTurns(gameId: string): Promise<GameTurn[]> {
    console.log(`MockStorage: getGameTurns(${gameId}) - returning empty array`);
    return [];
  }

  async createGameTurn(turn: InsertGameTurn): Promise<GameTurn> {
    console.log(`MockStorage: createGameTurn - returning mock turn`);
    return {
      id: 1,
      gameId: turn.gameId,
      playerId: turn.playerId,
      playerName: turn.playerName,
      turnNumber: turn.turnNumber,
      trickDescription: turn.trickDescription,
      result: turn.result,
      createdAt: new Date(),
    } as GameTurn;
  }
}

export const storage = db ? new DatabaseStorage() : new MockStorage();