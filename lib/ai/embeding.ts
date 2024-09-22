import { pipeline } from '@xenova/transformers';
import { db } from "@/db/db";
import { embeddings, EmbeddingWithSimilarity } from "@/db/schema/embeddings";
import { cosineDistance, desc, gt, sql, eq } from "drizzle-orm";
import redis from '@/db/redis';
import { products } from '@/db/schema';

let embeddingPipeline: any = null;

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

export async function findSimilarProducts(uuid: string, description: string, limit: number = 10) {
  const cacheKey = `alternatives:${uuid}`;
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult) as EmbeddingWithSimilarity[];
  }
  
  const product = await db.query.embeddings.findFirst({
    where: (embeddings, { eq }) => eq(embeddings.itemUUID, uuid)
  });
  if (!product) {
    return [];
  }

  let inputEmbedding = product.embedding;
  if(!inputEmbedding) {
    inputEmbedding = await generateEmbedding(description);
  }

  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, inputEmbedding)})`;
  const similarProducts = await db
    .select({ 
      itemId: embeddings.itemId,
      itemType: embeddings.itemType,
      name: products.name,
      website: products.website,
      description: products.description,
      thumb_url: products.thumb_url,
      tagline: products.tagline,
      uuid: products.uuid,
      launch_date: products.launched_at,
      translations: products.translations,
      similarity: similarity,
    })
    .from(embeddings)
    .innerJoin(products, eq(embeddings.itemUUID, products.uuid))
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .offset(1)
    .limit(limit);
  
  const result = similarProducts as unknown as EmbeddingWithSimilarity[];
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 3 * 24 * 60 * 60);
  return result;
}