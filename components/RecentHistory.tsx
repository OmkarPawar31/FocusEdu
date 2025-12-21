// components/RecentHistory.tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchHistory, SkillLevel } from '@/lib/types';
import { getSearchHistory, clearHistory } from '@/lib/storage';

interface Props {
  onHistoryClick: (topic: string, skillLevel: SkillLevel) => void;
  onUpdate?: () => void;
}

export default function RecentHistory({ onHistoryClick, onUpdate }: Props) {
  const [history, setHistory] = useState<SearchHistory[]>([]);

  const loadHistory = () => {
    setHistory(getSearchHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [onUpdate]);

  const handleClear = () => {
    if (confirm('Clear all search history?')) {
      clearHistory();
      loadHistory();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3 className="history-title">📜 Recent Searches</h3>
        <button onClick={handleClear} className="clear-button">
          Clear All
        </button>
      </div>

      <div className="history-list">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onHistoryClick(item.topic, item.skillLevel)}
            className="history-item"
          >
            <div className="history-info">
              <span className="history-topic">{item.topic}</span>
              <span className="history-level">{item.skillLevel}</span>
            </div>
            <span className="history-time">{formatTimestamp(item.timestamp)}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .history-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin: 24px 0;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .history-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .clear-button {
          padding: 6px 12px;
          background: transparent;
          color: #f44336;
          border: 1px solid #f44336;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-button:hover {
          background: #f44336;
          color: white;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .history-item:hover {
          background: #e8e8e8;
          transform: translateX(4px);
        }

        .history-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .history-topic {
          font-weight: 500;
          color: #1a1a1a;
          font-size: 15px;
        }

        .history-level {
          padding: 4px 8px;
          background: #667eea;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .history-time {
          color: #909090;
          font-size: 13px;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .history-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .history-time {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}