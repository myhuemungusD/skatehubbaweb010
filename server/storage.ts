import {
  users, tutorialSteps, userProgress, subscribers,
  type User, type UpsertUser, type TutorialStep, type InsertTutorialStep,
  type UserProgress, type InsertUserProgress, type UpdateUserProgress, type Subscriber
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
}

export class DatabaseStorage implements IStorage {
  // Use a private property to hold the db instance if needed for multiple methods,
  // or directly use the imported `db` as done in the original code.
  // For consistency with the original code's approach, we'll assume `db` is used directly.

  constructor() {
    // Initialize with default tutorial steps
    this.initializeDefaultTutorialSteps();
  }

  private async initializeDefaultTutorialSteps() {
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
}

export const storage = new DatabaseStorage();