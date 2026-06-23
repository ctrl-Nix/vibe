import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(request: NextRequest) {
  const pineconeKey = request.headers.get('x-pinecone-key');
  const openaiKey = request.headers.get('x-openai-key'); // Need OpenAI for embeddings

  if (!pineconeKey || !openaiKey) {
    return NextResponse.json(
      { error: "Pinecone API key and OpenAI key are required for Vector DB persistence. Add them in Settings." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, text, id = 'story-bible' } = body;

    const pc = new Pinecone({ apiKey: pineconeKey });
    // Defaulting to 'vibe-bible' index, the user should create this in Pinecone
    const index = pc.index('vibe-bible');

    if (action === 'upsert') {
      if (!text) {
        return NextResponse.json({ error: "Text is required for upsert" }, { status: 400 });
      }

      // Generate embedding using OpenAI
      const embedResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      });

      const embedData = await embedResponse.json();
      if (!embedResponse.ok) {
        throw new Error(embedData.error?.message || 'Failed to generate embedding');
      }

      const embedding = embedData.data[0].embedding;

      // Upsert to Pinecone
      await index.upsert([{
        id,
        values: embedding,
        metadata: { text }
      }]);

      return NextResponse.json({ success: true, message: "Story Bible upserted to Vector DB successfully." });
    } 
    
    if (action === 'query') {
      if (!text) {
         return NextResponse.json({ error: "Query text is required" }, { status: 400 });
      }

      // Generate embedding for query
      const embedResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      });

      const embedData = await embedResponse.json();
      const embedding = embedData.data[0].embedding;

      // Query Pinecone
      const queryResult = await index.query({
        vector: embedding,
        topK: 3,
        includeMetadata: true
      });

      return NextResponse.json({ success: true, data: queryResult.matches });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (err: any) {
    console.error('Vector DB API Error:', err);
    return NextResponse.json({ error: err.message || "Failed to interact with Vector DB" }, { status: 500 });
  }
}
