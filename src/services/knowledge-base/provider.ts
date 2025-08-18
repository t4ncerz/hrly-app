import { loadKnowledgeBase } from "./loader";
import { KnowledgeBaseMap } from "./types";

let knowledgeBaseInstance: KnowledgeBaseMap | null = null;

export function getKnowledgeBaseProvider(): KnowledgeBaseMap {
  if (!knowledgeBaseInstance) {
    knowledgeBaseInstance = loadKnowledgeBase();
  }
  return knowledgeBaseInstance;
}
