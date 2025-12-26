// feed-plan.ts
import type { UnitKey, FeedBaseType } from './feed-definition';

export type Slot = 'Morgens' | 'Mittags' | 'Abends';
export type PlanBaseType = FeedBaseType;

export interface FeedPlanItem {
  feedDefId?: string;
  baseType: PlanBaseType;

  name: string;
  amount: string;
  icon: string;

  unitKey: UnitKey;
  preset?: string;
  amountNum?: number;
}

export type FeedPlan = Record<Slot, FeedPlanItem[]>;
