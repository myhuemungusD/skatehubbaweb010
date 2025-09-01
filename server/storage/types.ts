import type { Subscriber } from "../../shared/schema";

export type CreateSubscriber = {
  email: string;
  firstName: string | null;
  isActive?: boolean; // default true
};

export interface SubscriberRepo {
  getSubscriberByEmail(email: string): Promise<Subscriber | null>;
  createSubscriber(data: CreateSubscriber): Promise<Subscriber>;
}