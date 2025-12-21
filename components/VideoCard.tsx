// components/VideoCard.tsx
'use client';

import { YouTubeVideo, StarredCourse } from '@/lib/types';
import { addStarredCourse, removeStarredCourse, isCoursStarred } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface Props {
  video: YouTubeVideo;
  onStarChange?: () => void;
}

export default function VideoCard({ video, onStarChange }: Props) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isCoursStarred(video.id, 'youtube'));
  }, [video.id]);

  const toggleStar = () => {
    if (starred) {
      removeStarredCourse(video.id, 'youtube');
      setStarred(false);
    } else {
      const starredCourse: StarredCourse = {
        id: video.id,
        title: video.title,
        type: 'youtube',
        url: video.url,
        thumbnail: video.thumbnail,
        starredAt: Date.now()
      };
      addStarredCourse(starredCourse);
      setStarred(true);
    }
    onStarChange?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <button
          className={`star-button ${starred ? 'starred' : ''}`}
          onClick={toggleStar}
          aria-label={starred ? 'Remove from starred' : 'Add to starred'}
        >
          {starred ? '★' : '☆'}
        </button>
      </div>
      
      <div className="video-content">
        <h3 className="video-title">
          <a href={video.url} target="_blank" rel="noopener noreferrer">
            {video.title}
          </a>
        </h3>
        
        <p className="video-channel">{video.channelTitle}</p>
        
        <p className="video-description">
          {video.description.slice(0, 150)}
          {video.description.length > 150 ? '...' : ''}
        </p>
        
        <div className="video-meta">
          <span className="video-date">{formatDate(video.publishedAt)}</span>
        </div>
        
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="watch-button"
        >
          Watch on YouTube →
        </a>
      </div>

      <style jsx>{`
        .video-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
          background: #f0f0f0;
        }

        .video-thumbnail img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .star-button {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: white;
          font-size: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .star-button:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .star-button.starred {
          color: #ffd700;
        }

        .video-content {
          padding: 16px;
        }

        .video-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
        }

        .video-title a {
          color: #1a1a1a;
          text-decoration: none;
        }

        .video-title a:hover {
          color: #ff0000;
        }

        .video-channel {
          margin: 0 0 12px 0;
          color: #606060;
          font-size: 14px;
        }

        .video-description {
          margin: 0 0 12px 0;
          color: #606060;
          font-size: 14px;
          line-height: 1.5;
        }

        .video-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #909090;
        }

        .watch-button {
          display: inline-block;
          background: #ff0000;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .watch-button:hover {
          background: #cc0000;
        }
      `}</style>
    </div>
  );
}