import { loadKnowledgeBase, loadKnowledgeBaseAsync } from "./loader";
import { KnowledgeBaseMap } from "./types";

let knowledgeBaseInstance: KnowledgeBaseMap | null = null;
let knowledgeBasePromise: Promise<KnowledgeBaseMap> | null = null;

export function getKnowledgeBaseProvider(): KnowledgeBaseMap {
  if (!knowledgeBaseInstance) {
    knowledgeBaseInstance = loadKnowledgeBase();
  }
  return knowledgeBaseInstance;
}

export async function getKnowledgeBaseProviderAsync(): Promise<KnowledgeBaseMap> {
  if (knowledgeBaseInstance) return knowledgeBaseInstance;
  if (!knowledgeBasePromise) {
    knowledgeBasePromise = loadKnowledgeBaseAsync();
  }
  knowledgeBaseInstance = await knowledgeBasePromise;
  return knowledgeBaseInstance;
}
