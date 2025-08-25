import { loadEngagementSatisfactionBaseAsync } from "./engagement-satisfaction-loader";
import { EngagementSatisfactionMap } from "./engagement-satisfaction-types";

let engagementSatisfactionInstance: EngagementSatisfactionMap | null = null;
let engagementSatisfactionPromise: Promise<EngagementSatisfactionMap> | null =
  null;

export async function getEngagementSatisfactionProviderAsync(
  baseUrl?: string
): Promise<EngagementSatisfactionMap> {
  if (engagementSatisfactionInstance) return engagementSatisfactionInstance;
  if (!engagementSatisfactionPromise) {
    engagementSatisfactionPromise =
      loadEngagementSatisfactionBaseAsync(baseUrl);
  }
  engagementSatisfactionInstance = await engagementSatisfactionPromise;
  return engagementSatisfactionInstance;
}
