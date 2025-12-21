// app/api/recommendations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

interface RequestBody {
  topic: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  history?: string[];
  starredCourses?: any[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { topic, skillLevel, history = [], starredCourses = [] } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Parallel execution for better performance
    const [youtubeVideos, aiRecommendations] = await Promise.all([
      fetchYouTubeVideos(topic, skillLevel),
      generateAIRecommendations(topic, skillLevel, history, starredCourses)
    ]);

    return NextResponse.json({
      youtubeVideos,
      udemyCourses: aiRecommendations.udemyCourses,
      aiInsights: aiRecommendations.insights
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

async function fetchYouTubeVideos(topic: string, skillLevel: string) {
  try {
    // Construct search query based on skill level
    const levelPrefix = {
      beginner: 'tutorial for beginners',
      intermediate: 'intermediate guide',
      advanced: 'advanced concepts'
    }[skillLevel] || 'tutorial';

    const searchQuery = `${topic} ${levelPrefix}`;
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(searchQuery)}&` +
      `type=video&maxResults=10&order=relevance&` +
      `videoDuration=medium&videoEmbeddable=true&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
}

async function generateAIRecommendations(
  topic: string,
  skillLevel: string,
  history: string[],
  starredCourses: any[]
) {
  try {
    const prompt = buildAIPrompt(topic, skillLevel, history, starredCourses);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert education advisor specializing in online learning platforms. Provide course recommendations in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const aiResponse = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(aiResponse);

    return {
      udemyCourses: parsed.courses || [],
      insights: parsed.insights || ''
    };

  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      udemyCourses: [],
      insights: 'Unable to generate AI recommendations at this time.'
    };
  }
}

function buildAIPrompt(
  topic: string,
  skillLevel: string,
  history: string[],
  starredCourses: any[]
): string {
  const historyContext = history.length > 0
    ? `The user has recently searched for: ${history.join(', ')}.`
    : '';

  const starredContext = starredCourses.length > 0
    ? `The user has starred courses related to: ${starredCourses.map(c => c.title).join(', ')}.`
    : '';

  return `
As an education advisor, recommend 5 Udemy courses for learning "${topic}" at ${skillLevel} level.

Context:
${historyContext}
${starredContext}

Provide your response as a JSON object with this exact structure:
{
  "courses": [
    {
      "id": "unique-id-1",
      "title": "Course Title",
      "description": "Brief 2-sentence description of what the course covers",
      "instructor": "Typical instructor expertise (e.g., 'Industry Expert' or 'Senior Developer')",
      "level": "${skillLevel}",
      "url": "https://www.udemy.com/courses/search/?q=${encodeURIComponent(topic)}",
      "rating": 4.5,
      "isAiGenerated": true
    }
  ],
  "insights": "A brief 2-3 sentence personalized insight about the user's learning path based on their topic, skill level, and history."
}

Important:
- All URLs should point to Udemy's search page for the topic since we don't have direct course links
- Make recommendations realistic and relevant to ${skillLevel} learners
- Course titles should sound professional and realistic
- If user history shows progression, acknowledge that in insights
- Keep descriptions concise and actionable
`.trim();
}