import { 
  users, tutorialSteps, userProgress,
  type User, type InsertUser, type TutorialStep, type InsertTutorialStep,
  type UserProgress, type InsertUserProgress, type UpdateUserProgress
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnboardingStatus(userId: number, completed: boolean, currentStep?: number): Promise<User | undefined>;
  
  // Tutorial steps methods
  getAllTutorialSteps(): Promise<TutorialStep[]>;
  getTutorialStep(id: number): Promise<TutorialStep | undefined>;
  createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep>;
  
  // User progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserStepProgress(userId: number, stepId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, stepId: number, updates: UpdateUserProgress): Promise<UserProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tutorialSteps: Map<number, TutorialStep>;
  private userProgress: Map<string, UserProgress>; // key: `${userId}-${stepId}`
  private currentUserId: number;
  private currentStepId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.tutorialSteps = new Map();
    this.userProgress = new Map();
    this.currentUserId = 1;
    this.currentStepId = 1;
    this.currentProgressId = 1;
    
    // Initialize with default tutorial steps
    this.initializeDefaultTutorialSteps();
  }

  private async initializeDefaultTutorialSteps() {
    const defaultSteps: InsertTutorialStep[] = [
      {
        title: "Welcome to SkateHubba",
        description: "Your skateboarding journey starts here! Let's get you set up.",
        type: "intro",
        content: {
          videoUrl: "/tutorial/welcome.mp4"
        },
        order: 1,
        isActive: true
      },
      {
        title: "Navigate Your Map",
        description: "Learn how to explore skate spots and check in at locations.",
        type: "interactive",
        content: {
          interactiveElements: [
            { type: 'tap', target: 'map-spot', instruction: 'Tap on a skate spot to see details' },
            { type: 'tap', target: 'checkin-button', instruction: 'Tap Check-In to mark your visit' }
          ]
        },
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
        },
        order: 3,
        isActive: true
      },
      {
        title: "Customize Your Avatar",
        description: "Make your skater unique with custom gear and style.",
        type: "interactive",
        content: {
          interactiveElements: [
            { type: 'tap', target: 'avatar-editor', instruction: 'Tap to open avatar customization' },
            { type: 'drag', target: 'gear-item', instruction: 'Drag items to equip them' }
          ]
        },
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
        },
        order: 5,
        isActive: true
      }
    ];

    for (const step of defaultSteps) {
      await this.createTutorialStep(step);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      onboardingCompleted: false,
      currentTutorialStep: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserOnboardingStatus(userId: number, completed: boolean, currentStep?: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      onboardingCompleted: completed,
      currentTutorialStep: currentStep ?? user.currentTutorialStep
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Tutorial steps methods
  async getAllTutorialSteps(): Promise<TutorialStep[]> {
    return Array.from(this.tutorialSteps.values())
      .filter(step => step.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async getTutorialStep(id: number): Promise<TutorialStep | undefined> {
    return this.tutorialSteps.get(id);
  }

  async createTutorialStep(stepData: InsertTutorialStep): Promise<TutorialStep> {
    const id = this.currentStepId++;
    const step: TutorialStep = { 
      ...stepData, 
      id,
      content: stepData.content || null
    };
    this.tutorialSteps.set(id, step);
    return step;
  }

  // User progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId)
      .sort((a, b) => a.stepId - b.stepId);
  }

  async getUserStepProgress(userId: number, stepId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${stepId}`;
    return this.userProgress.get(key);
  }

  async createUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = { 
      ...progressData, 
      id,
      completed: progressData.completed || false,
      completedAt: null,
      timeSpent: progressData.timeSpent || null,
      interactionData: progressData.interactionData || null
    };
    const key = `${progressData.userId}-${progressData.stepId}`;
    this.userProgress.set(key, progress);
    return progress;
  }

  async updateUserProgress(userId: number, stepId: number, updates: UpdateUserProgress): Promise<UserProgress | undefined> {
    const key = `${userId}-${stepId}`;
    const existing = this.userProgress.get(key);
    if (!existing) return undefined;

    const updatedProgress: UserProgress = {
      ...existing,
      completed: updates.completed ?? existing.completed,
      timeSpent: updates.timeSpent ?? existing.timeSpent,
      interactionData: updates.interactionData ?? existing.interactionData,
      completedAt: updates.completed ? new Date() : existing.completedAt
    };

    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }
}

export const storage = new MemStorage();
