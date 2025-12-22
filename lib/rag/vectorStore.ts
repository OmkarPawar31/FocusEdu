// Vector Store for Resume Analysis RAG System
// Uses in-memory search for Vercel serverless compatibility

import { resumeKnowledgeBase } from './knowledgeBase';

// Simple in-memory vector store for serverless environments
// Note: ChromaDB doesn't work well in serverless due to persistence requirements

interface SearchResult {
  content: string;
  score: number;
  category: string;
}

// TF-IDF based similarity search (works in serverless)
function computeTFIDF(text: string, documents: string[]): number[] {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const wordSet = new Set(words);
  
  // Calculate document frequencies
  const df: Record<string, number> = {};
  documents.forEach(doc => {
    const docWords = new Set(doc.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    docWords.forEach(word => {
      df[word] = (df[word] || 0) + 1;
    });
  });
  
  // Calculate TF-IDF scores for each document
  return documents.map(doc => {
    const docWords = doc.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const docWordCounts: Record<string, number> = {};
    docWords.forEach(w => { docWordCounts[w] = (docWordCounts[w] || 0) + 1; });
    
    let score = 0;
    wordSet.forEach(word => {
      if (docWordCounts[word]) {
        const tf = docWordCounts[word] / docWords.length;
        const idf = Math.log(documents.length / (df[word] || 1));
        score += tf * idf;
      }
    });
    return score;
  });
}

// Search for relevant documents based on query
export async function searchVectorStore(
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
  const documents = resumeKnowledgeBase.map(item => item.content);
  const scores = computeTFIDF(query, documents);
  
  const results = resumeKnowledgeBase
    .map((item, index) => ({
      content: item.content,
      score: scores[index],
      category: item.category,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return results;
}

// Search by category filter
export async function searchByCategory(
  query: string,
  categories: string[],
  topK: number = 5
): Promise<SearchResult[]> {
  const filteredKB = resumeKnowledgeBase.filter(item => 
    categories.includes(item.category)
  );
  
  const documents = filteredKB.map(item => item.content);
  const scores = computeTFIDF(query, documents);
  
  const results = filteredKB
    .map((item, index) => ({
      content: item.content,
      score: scores[index],
      category: item.category,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return results;
}

// Get relevant context for resume analysis using RAG
export async function getRelevantContext(resumeText: string): Promise<string> {
  try {
    // Get general resume best practices
    const formatResults = await searchByCategory(
      'resume format structure best practices',
      ['resume_format', 'achievements', 'ats'],
      3
    );

    // Get skill-specific context based on resume content
    const skillResults = await searchVectorStore(resumeText, 4);

    // Combine unique results
    const seen = new Set<string>();
    const allResults: string[] = [];

    [...formatResults, ...skillResults].forEach((r) => {
      const key = r.content.substring(0, 50);
      if (!seen.has(key) && r.content) {
        seen.add(key);
        allResults.push(r.content);
      }
    });

    const context = allResults.join('\n\n---\n\n');

    return `## Retrieved Market Standards:\n\n${context}`;
  } catch (error) {
    console.error('Error retrieving context from Chroma:', error);
    // Fallback to basic context
    return getFallbackContext();
  }
}

// Fallback context if Chroma fails
function getFallbackContext(): string {
  return `## Market Standards (2024-2025):

### In-Demand Technical Skills:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Python, Go, GraphQL, REST APIs
- Cloud: AWS, Azure, GCP, Docker, Kubernetes, Terraform
- Data/AI: Python, SQL, TensorFlow, PyTorch, LangChain

### Resume Best Practices:
- Use action verbs: Led, Developed, Implemented, Optimized
- Quantify achievements with metrics (%, $, numbers)
- Keep to 1-2 pages
- Include: Contact, Summary, Experience, Skills, Education
- Tailor keywords for ATS systems

### Soft Skills in Demand:
- Leadership & team collaboration
- Communication (written/verbal)
- Problem-solving
- Agile/Scrum methodologies`;
}
