import { loadEngagementSatisfactionBase } from "./engagement-satisfaction-loader";
import { EngagementSatisfactionMap } from "./engagement-satisfaction-types";

let engagementSatisfactionInstance: EngagementSatisfactionMap | null = null;

export function getEngagementSatisfactionProvider(): EngagementSatisfactionMap {
  if (!engagementSatisfactionInstance) {
    engagementSatisfactionInstance = loadEngagementSatisfactionBase();
  }
  return engagementSatisfactionInstance;
}
