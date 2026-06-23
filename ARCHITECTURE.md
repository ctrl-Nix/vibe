# VIBE Architecture

VIBE is built as a private, client-first Next.js application designed to provide a secure and iterative workspace for creative writers. This document outlines the core architectural decisions and patterns used in the project.

## 1. Zero-Server & BYOK (Bring Your Own Key)

VIBE is designed to run entirely in the browser (or at the edge), ensuring maximum privacy.
- **BYOK**: Users must provide their own API keys for OpenAI, Anthropic, or Google Gemini. These keys are stored purely in `localStorage` and sent directly to the respective APIs (proxied through Next.js API routes only to hide them from the client-side bundle, but never stored on a database).
- **Zero-Server Storage**: By default, the application state (Story Bible, generations) is kept in `localStorage`.

## 2. Iterative Agent Loop (The Judge)

To move beyond simple "one-shot" LLM wrappers, VIBE implements iterative agent loops. The primary example is the **Judge Tool**.
Instead of just scoring a piece of text once, the Judge tool performs a multi-step workflow:
1. **Critique**: Evaluate the original text to identify strengths and weaknesses.
2. **Rewrite**: Use the critique as context to generate an improved version of the text.
3. **Re-critique**: Evaluate the rewritten text to ensure the improvements were successfully applied.

This pattern produces significantly higher quality results and mimics human editorial processes.

## 3. Vector DB Story Bible Persistence

As projects scale, `localStorage` becomes insufficient for complex retrieval.
- We integrate **Pinecone** as a free Vector DB to persist the Story Bible.
- This allows semantic search and retrieval of characters, settings, and plot points across the entire workflow, feeding exactly the right context into the LLM prompts without blowing up the context window.
- Embeddings are generated using standard models (e.g., OpenAI `text-embedding-3-small`) and stored/upserted to Pinecone.

## 4. Modular Workflow Chain

The application is structured as a series of connected, modular tools:
- `Oracle` -> `Plotline` -> `Judge` -> `Prompt Optimizer`
- Context flows linearly through these tools. Outputs from one tool can be seamlessly passed as inputs to the next, with the overarching Story Bible acting as a global state context.

## 5. Technology Choices
- **Next.js 14 App Router**: For seamless API routes and React Server Components.
- **Tailwind CSS & Framer Motion**: For the neobrutalist aesthetic and fluid micro-animations.
- **TypeScript**: Ensuring strict typing for the structured LLM JSON outputs.
