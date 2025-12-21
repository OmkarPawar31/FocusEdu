// app/suggestions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import CourseCard from '@/components/CourseCard';
import { YouTubeVideo, UdemyCourse, SkillLevel } from '@/lib/types';
import { getSearchHistory, getStarredCourses } from '@/lib/storage';

export default function SuggestionsPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if user has any history or starred courses
    const history = getSearchHistory();
    const starred = getStarredCourses();
    setHasData(history.length > 0 || starred.length > 0);
  }, []);

  const generateSuggestions = async () => {
    setLoading(true);

    try {
      const history = getSearchHistory();
      const starred = getStarredCourses();

      if (history.length === 0 && starred.length === 0) {
        alert('Please search for some topics first to get personalized suggestions!');
        setLoading(false);
        return;
      }

      // Get the most recent topic from history
      const recentTopic = history[0]?.topic || 'programming';
      const historyTopics = history.map(h => h.topic);

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: recentTopic,
          skillLevel,
          history: historyTopics,
          starredCourses: starred,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setVideos(data.youtubeVideos || []);
      setCourses(data.udemyCourses || []);
      setAiInsights(data.aiInsights || '');
    } catch (err) {
      console.error('Error generating suggestions:', err);
      alert('Failed to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suggestions-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🎓 FocusedU</h1>
          <nav className="nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/suggestions" className="nav-link active">AI Suggestions</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2 className="hero-title">
            ✨ AI-Powered Learning Suggestions
          </h2>
          <p className="hero-subtitle">
            Get personalized recommendations based on your learning history and preferences
          </p>
        </section>

        <div className="control-section">
          <div className="skill-selector">
            <label className="label">Select Your Current Skill Level:</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              className="select"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <button
            onClick={generateSuggestions}
            disabled={loading || !hasData}
            className="generate-button"
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Generating...
              </>
            ) : (
              <>
                🤖 Generate AI Suggestions
              </>
            )}
          </button>

          {!hasData && (
            <p className="hint-text">
              💡 Start by searching for topics on the <Link href="/">home page</Link> to get personalized suggestions!
            </p>
          )}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Analyzing your learning patterns and generating personalized suggestions...</p>
          </div>
        )}

        {!loading && (videos.length > 0 || courses.length > 0) && (
          <>
            {aiInsights && (
              <div className="insights-card">
                <h3>🎯 Personalized Insights</h3>
                <p>{aiInsights}</p>
              </div>
            )}

            {videos.length > 0 && (
              <section className="results-section">
                <h2 className="section-title">📺 Recommended YouTube Videos</h2>
                <div className="results-grid">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}

            {courses.length > 0 && (
              <section className="results-section">
                <h2 className="section-title">🎓 Curated Udemy Courses</h2>
                <div className="results-grid">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && hasData && videos.length === 0 && courses.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🚀</div>
            <h3>Ready to get personalized suggestions?</h3>
            <p>Click the "Generate AI Suggestions" button above to receive recommendations tailored to your learning journey!</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .suggestions-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .header {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
        }

        .nav {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          color: #606060;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #667eea;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-title {
          font-size: 42px;
          font-weight: 700;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #606060;
          margin: 0;
        }

        .control-section {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
          text-align: center;
        }

        .skill-selector {
          margin-bottom: 24px;
        }

        .label {
          display: block;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1a1a1a;
          font-size: 16px;
        }

        .select {
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          min-width: 200px;
          transition: border-color 0.2s;
        }

        .select:focus {
          outline: none;
          border-color: #667eea;
        }

        .generate-button {
          padding: 16px 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .hint-text {
          margin-top: 16px;
          color: #606060;
          font-size: 14px;
        }

        .hint-text a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .loading-container {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 20px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .insights-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .insights-card h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
        }

        .insights-card p {
          margin: 0;
          line-height: 1.6;
          font-size: 16px;
        }

        .results-section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #1a1a1a;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 24px;
          margin-bottom: 12px;
          color: #1a1a1a;
        }

        .empty-state p {
          font-size: 16px;
          color: #606060;
          max-width: 500px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .generate-button {
            font-size: 16px;
            padding: 14px 32px;
          }
        }
      `}</style>
    </div>
  );
}