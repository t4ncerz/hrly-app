import {
  loadEngagementSatisfactionBase,
  loadEngagementSatisfactionBaseAsync,
} from "./engagement-satisfaction-loader";
import { EngagementSatisfactionMap } from "./engagement-satisfaction-types";

let engagementSatisfactionInstance: EngagementSatisfactionMap | null = null;
let engagementSatisfactionPromise: Promise<EngagementSatisfactionMap> | null =
  null;

export function getEngagementSatisfactionProvider(): EngagementSatisfactionMap {
  if (!engagementSatisfactionInstance) {
    engagementSatisfactionInstance = loadEngagementSatisfactionBase();
  }
  return engagementSatisfactionInstance;
}

export async function getEngagementSatisfactionProviderAsync(): Promise<EngagementSatisfactionMap> {
  if (engagementSatisfactionInstance) return engagementSatisfactionInstance;
  if (!engagementSatisfactionPromise) {
    engagementSatisfactionPromise = loadEngagementSatisfactionBaseAsync();
  }
  engagementSatisfactionInstance = await engagementSatisfactionPromise;
  return engagementSatisfactionInstance;
}
