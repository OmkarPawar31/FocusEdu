// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { SkillLevel } from '@/lib/types';

interface Props {
  onSearch: (topic: string, skillLevel: SkillLevel) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [topic, setTopic] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic.trim(), skillLevel);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn? (e.g., React, Python, Machine Learning)"
          className="search-input"
          disabled={isLoading}
        />
        
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
          className="skill-select"
          disabled={isLoading}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <span className="loading-spinner">⟳</span>
          ) : (
            '🔍 Search'
          )}
        </button>
      </div>

      <style jsx>{`
        .search-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .search-wrapper {
          display: flex;
          gap: 12px;
          align-items: stretch;
          background: white;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .search-input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          background: #f5f5f5;
          transition: all 0.2s;
        }

        .search-input:focus {
          background: white;
          border-color: #667eea;
        }

        .search-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .skill-select {
          padding: 14px 16px;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          background: #f5f5f5;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
          min-width: 150px;
        }

        .skill-select:focus {
          background: white;
          border-color: #667eea;
        }

        .skill-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .search-button {
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .search-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .search-wrapper {
            flex-direction: column;
          }

          .skill-select {
            width: 100%;
          }

          .search-button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}