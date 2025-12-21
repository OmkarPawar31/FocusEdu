// components/TopicButtons.tsx
'use client';

interface Props {
  onTopicClick: (topic: string) => void;
}

const POPULAR_TOPICS = [
  { name: 'React', icon: '⚛️', color: '#61dafb' },
  { name: 'Python', icon: '🐍', color: '#3776ab' },
  { name: 'Machine Learning', icon: '🤖', color: '#ff6f00' },
  { name: 'Data Science', icon: '📊', color: '#00897b' },
  { name: 'Web Development', icon: '🌐', color: '#e91e63' },
  { name: 'JavaScript', icon: '💛', color: '#f7df1e' },
  { name: 'AI & Deep Learning', icon: '🧠', color: '#8e24aa' },
  { name: 'Cloud Computing', icon: '☁️', color: '#1976d2' }
];

export default function TopicButtons({ onTopicClick }: Props) {
  return (
    <div className="topic-buttons-container">
      <h3 className="section-title">🔥 Popular Topics</h3>
      <div className="topics-grid">
        {POPULAR_TOPICS.map((topic) => (
          <button
            key={topic.name}
            onClick={() => onTopicClick(topic.name)}
            className="topic-button"
            style={{ borderColor: topic.color }}
          >
            <span className="topic-icon">{topic.icon}</span>
            <span className="topic-name">{topic.name}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .topic-buttons-container {
          margin: 32px 0;
        }

        .section-title {
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #1a1a1a;
        }

        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .topic-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border: 2px solid;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .topic-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .topic-icon {
          font-size: 24px;
        }

        .topic-name {
          flex: 1;
        }

        @media (max-width: 768px) {
          .topics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .topic-button {
            padding: 12px 16px;
            font-size: 14px;
          }

          .topic-icon {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}