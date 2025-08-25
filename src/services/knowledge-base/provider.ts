import { loadKnowledgeBaseAsync } from "./loader";
import { KnowledgeBaseMap } from "./types";

let knowledgeBaseInstance: KnowledgeBaseMap | null = null;
let knowledgeBasePromise: Promise<KnowledgeBaseMap> | null = null;

export async function getKnowledgeBaseProviderAsync(
  baseUrl?: string
): Promise<KnowledgeBaseMap> {
  if (knowledgeBaseInstance) return knowledgeBaseInstance;
  if (!knowledgeBasePromise) {
    knowledgeBasePromise = loadKnowledgeBaseAsync(baseUrl);
  }
  knowledgeBaseInstance = await knowledgeBasePromise;
  return knowledgeBaseInstance;
}
