import {
  users, tutorialSteps, userProgress, subscribers,
  type User, type UpsertUser, type TutorialStep, type InsertTutorialStep,
  type UserProgress, type InsertUserProgress, type UpdateUserProgress, type Subscriber
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@shared/schema";

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
  createSubscriber(data: Omit<Subscriber, 'id' | 'createdAt'>): Promise<Subscriber>;
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
      // Check if tutorial steps already exist
      const existingSteps = await db.select().from(tutorialSteps).limit(1);
      if (existingSteps.length > 0) return;

      const defaultSteps = [
        {
          title: "Welcome to SkateHubba",
          description: "Your skateboarding journey starts here! Let's get you set up.",
          type: "intro",
          content: {
            videoUrl: "/tutorial/welcome.mp4"
          } as const,
          order: 1,
          isActive: true
        },
        {
          title: "Navigate Your Map",
          description: "Learn how to explore skate spots and check in at locations.",
          type: "interactive",
          content: {
            interactiveElements: [
              { type: 'tap' as const, target: 'map-spot', instruction: 'Tap on a skate spot to see details' },
              { type: 'tap' as const, target: 'checkin-button', instruction: 'Tap Check-In to mark your visit' }
            ]
          } as const,
          order: 2,
          isActive: true
        },
        {
          title: "Drop Your First Clip",
          description: "Record and share your first skateboarding clip in the Trenches.",
          type: "challenge",
          content: {
            challengeData: {
              action: "Upload a video to Trenches",
              expectedResult: "Successfully posted clip"
            }
          } as const,
          order: 3,
          isActive: true
        },
        {
          title: "Customize Your Avatar",
          description: "Make your skater unique with custom gear and style.",
          type: "interactive",
          content: {
            interactiveElements: [
              { type: 'tap' as const, target: 'avatar-editor', instruction: 'Tap to open avatar customization' },
              { type: 'drag' as const, target: 'gear-item', instruction: 'Drag items to equip them' }
            ]
          } as const,
          order: 4,
          isActive: true
        },
        {
          title: "Challenge a Friend",
          description: "Start your first S.K.A.T.E. battle with another skater.",
          type: "challenge",
          content: {
            challengeData: {
              action: "Send a S.K.A.T.E. challenge",
              expectedResult: "Challenge sent successfully"
            }
          } as const,
          order: 5,
          isActive: true
        }
      ];

      for (const step of defaultSteps) {
        await this.createTutorialStep(step);
      }
    } catch (error) {
      console.error('Error initializing default tutorial steps:', error);
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
  async createSubscriber(data: Omit<Subscriber, 'id' | 'subscribedAt'>): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(data)
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