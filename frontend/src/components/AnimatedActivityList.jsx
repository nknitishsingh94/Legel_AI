import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Scale, ShieldCheck, Zap } from 'lucide-react';

const legalNotifications = [
  {
    name: "Petition Drafted",
    description: "Special Leave Petition (SLP) generated for Supreme Court",
    time: "Just now",
    icon: <FileText size={18} color="#ffffff" />,
    color: "#059669",
    tag: "Drafting AI"
  },
  {
    name: "Judgement Analyzed",
    description: "Ratio extracted from Kesavananda Bharati case",
    time: "2m ago",
    icon: <Sparkles size={18} color="#ffffff" />,
    color: "#b8860b",
    tag: "Deep RAG"
  },
  {
    name: "Bail Draft Ready",
    description: "Anticipatory Bail prepared under BNSS Section 482",
    time: "5m ago",
    icon: <ShieldCheck size={18} color="#ffffff" />,
    color: "#2563eb",
    tag: "BNS Reform"
  },
  {
    name: "Citation Verified",
    description: "12 High Court precedents verified with AIR records",
    time: "8m ago",
    icon: <Scale size={18} color="#ffffff" />,
    color: "#7c3aed",
    tag: "Research"
  },
  {
    name: "Contract Risk Flagged",
    description: "Indemnity & unlimited liability clause review",
    time: "12m ago",
    icon: <Zap size={18} color="#ffffff" />,
    color: "#d97706",
    tag: "Contract AI"
  }
];

export const AnimatedActivityList = () => {
  const [items, setItems] = useState(legalNotifications.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const nextIndex = (legalNotifications.findIndex(n => n.name === prev[0].name) + 1) % legalNotifications.length;
        const newItem = {
          ...legalNotifications[nextIndex],
          id: Date.now()
        };
        return [newItem, ...prev.slice(0, 2)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-activity-container">
      <div className="activity-feed-header">
        <div className="live-dot-pulse"></div>
        <span>Live Legal AI Activity</span>
      </div>

      <div className="animated-list-wrapper">
        {items.map((item, idx) => (
          <figure
            key={item.id || idx}
            className="activity-notification-card animate-slide-down"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="notification-icon-box" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="notification-text-box">
              <div className="notification-header-row">
                <span className="notification-name">{item.name}</span>
                <span className="dot-separator">·</span>
                <span className="notification-time">{item.time}</span>
              </div>
              <p className="notification-desc">{item.description}</p>
            </div>
          </figure>
        ))}
      </div>

      <div className="animated-list-fade-bottom"></div>
    </div>
  );
};

export default AnimatedActivityList;
