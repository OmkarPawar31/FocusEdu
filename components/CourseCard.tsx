// components/CourseCard.tsx
'use client';

import { UdemyCourse, StarredCourse } from '@/lib/types';
import { addStarredCourse, removeStarredCourse, isCoursStarred } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface Props {
  course: UdemyCourse;
  onStarChange?: () => void;
}

export default function CourseCard({ course, onStarChange }: Props) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isCoursStarred(course.id, 'udemy'));
  }, [course.id]);

  const toggleStar = () => {
    if (starred) {
      removeStarredCourse(course.id, 'udemy');
      setStarred(false);
    } else {
      const starredCourse: StarredCourse = {
        id: course.id,
        title: course.title,
        type: 'udemy',
        url: course.url,
        starredAt: Date.now()
      };
      addStarredCourse(starredCourse);
      setStarred(true);
    }
    onStarChange?.();
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return '#4caf50';
      case 'intermediate':
        return '#ff9800';
      case 'advanced':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <div className="course-card">
      <div className="course-header">
        <div className="course-badge" style={{ background: getLevelColor(course.level) }}>
          {course.level}
        </div>
        <button
          className={`star-button ${starred ? 'starred' : ''}`}
          onClick={toggleStar}
          aria-label={starred ? 'Remove from starred' : 'Add to starred'}
        >
          {starred ? '★' : '☆'}
        </button>
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        
        <p className="course-instructor">
          <span className="instructor-icon">👨‍🏫</span>
          {course.instructor}
        </p>

        <p className="course-description">{course.description}</p>

        {course.rating && (
          <div className="course-rating">
            <span className="rating-stars">★ {course.rating.toFixed(1)}</span>
            <span className="rating-text">Course Rating</span>
          </div>
        )}

        {course.isAiGenerated && (
          <div className="ai-badge">
            <span className="ai-icon">✨</span>
            AI Recommended
          </div>
        )}

        <a 
          href={course.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="explore-button"
        >
          Explore on Udemy →
        </a>
      </div>

      <style jsx>{`
        .course-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          border-left: 4px solid ${getLevelColor(course.level)};
        }

        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 16px 0 16px;
        }

        .course-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .star-button {
          background: transparent;
          border: none;
          color: #ddd;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
          line-height: 1;
        }

        .star-button:hover {
          transform: scale(1.2);
        }

        .star-button.starred {
          color: #ffd700;
        }

        .course-content {
          padding: 16px;
        }

        .course-title {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          color: #1a1a1a;
        }

        .course-instructor {
          margin: 0 0 12px 0;
          color: #606060;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .instructor-icon {
          font-size: 16px;
        }

        .course-description {
          margin: 0 0 16px 0;
          color: #606060;
          font-size: 14px;
          line-height: 1.6;
        }

        .course-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .rating-stars {
          color: #ffa500;
          font-size: 16px;
          font-weight: 600;
        }

        .rating-text {
          color: #909090;
          font-size: 13px;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .ai-icon {
          font-size: 14px;
        }

        .explore-button {
          display: inline-block;
          background: #a435f0;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
          width: 100%;
          text-align: center;
        }

        .explore-button:hover {
          background: #8710d8;
        }
      `}</style>
    </div>
  );
}