// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import TopicButtons from '@/components/TopicButtons';
import VideoCard from '@/components/VideoCard';
import CourseCard from '@/components/CourseCard';
import RecentHistory from '@/components/RecentHistory';
import { YouTubeVideo, UdemyCourse, SkillLevel } from '@/lib/types';
import { addToHistory } from '@/lib/storage';

export default function HomePage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [historyUpdate, setHistoryUpdate] = useState(0);

  const fetchRecommendations = async (topic: string, skillLevel: SkillLevel) => {
    setLoading(true);
    setError(null);
    setCurrentTopic(topic);
    setVideos([]);
    setCourses([]);
    setAiInsights('');

    try {
      // Add to history
      addToHistory(topic, skillLevel);
      setHistoryUpdate(prev => prev + 1);

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          skillLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setVideos(data.youtubeVideos || []);
      setCourses(data.udemyCourses || []);
      setAiInsights(data.aiInsights || '');
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    fetchRecommendations(topic, 'beginner');
  };

  const handleHistoryClick = (topic: string, skillLevel: SkillLevel) => {
    fetchRecommendations(topic, skillLevel);
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🎓 FocusedU</h1>
          <nav className="nav">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="/suggestions" className="nav-link">AI Suggestions</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2 className="hero-title">
            Discover Your Perfect Learning Path
          </h2>
          <p className="hero-subtitle">
            AI-powered recommendations for YouTube videos and Udemy courses
          </p>
        </section>

        <section className="search-section">
          <SearchBar onSearch={fetchRecommendations} isLoading={loading} />
        </section>

        <TopicButtons onTopicClick={handleTopicClick} />

        <RecentHistory 
          onHistoryClick={handleHistoryClick}
          onUpdate={() => setHistoryUpdate(prev => prev + 1)}
        />

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Finding the best learning resources for you...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}

        {!loading && currentTopic && (
          <>
            {aiInsights && (
              <div className="insights-card">
                <h3>✨ AI Insights</h3>
                <p>{aiInsights}</p>
              </div>
            )}

            {videos.length > 0 && (
              <section className="results-section">
                <h2 className="section-title">
                  📺 YouTube Videos for "{currentTopic}"
                </h2>
                <div className="results-grid">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}

            {courses.length > 0 && (
              <section className="results-section">
                <h2 className="section-title">
                  🎓 Recommended Udemy Courses
                </h2>
                <div className="info-banner">
                  ℹ️ These courses are AI-recommended based on your search. 
                  Click to explore similar courses on Udemy.
                </div>
                <div className="results-grid">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && !currentTopic && (
          <div className="welcome-message">
            <h3>👋 Welcome to FocusedU!</h3>
            <p>Search for a topic or click on a popular topic to get started</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .home-page {
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

        .search-section {
          margin-bottom: 48px;
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

        .error-container {
          background: #ffebee;
          color: #c62828;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
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

        .info-banner {
          background: #e3f2fd;
          color: #1565c0;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .welcome-message {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
        }

        .welcome-message h3 {
          font-size: 28px;
          margin-bottom: 12px;
          color: #1a1a1a;
        }

        .welcome-message p {
          font-size: 16px;
          color: #606060;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}