import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Scale, ShieldCheck, Zap } from 'lucide-react';

const notificationsList = [
  {
    name: "Petition Drafted",
    description: "Special Leave Petition (SLP) generated for Supreme Court",
    time: "Just now",
    icon: <FileText size={18} color="#ffffff" />,
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "rgba(16, 185, 129, 0.25)"
  },
  {
    name: "Judgement Analyzed",
    description: "Ratio extracted from Kesavananda Bharati case",
    time: "2m ago",
    icon: <Sparkles size={18} color="#ffffff" />,
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    shadow: "rgba(245, 158, 11, 0.25)"
  },
  {
    name: "Bail Draft Ready",
    description: "Anticipatory Bail prepared under BNSS Section 482",
    time: "5m ago",
    icon: <ShieldCheck size={18} color="#ffffff" />,
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    shadow: "rgba(59, 130, 246, 0.25)"
  },
  {
    name: "Citation Verified",
    description: "12 High Court precedents verified with AIR records",
    time: "8m ago",
    icon: <Scale size={18} color="#ffffff" />,
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    shadow: "rgba(139, 92, 246, 0.25)"
  },
  {
    name: "Contract Risk Flagged",
    description: "Indemnity & unlimited liability clause review",
    time: "12m ago",
    icon: <Zap size={18} color="#ffffff" />,
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    shadow: "rgba(236, 72, 153, 0.25)"
  }
];

export const AnimatedActivityList = () => {
  const [notifications, setNotifications] = useState(notificationsList.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => {
        const nextIndex = (notificationsList.findIndex(n => n.name === prev[0].name) + 1) % notificationsList.length;
        const newItem = {
          ...notificationsList[nextIndex],
          id: Date.now() + Math.random()
        };
        return [newItem, ...prev.slice(0, 3)];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activity-card-container">
      <div className="activity-card-glow-bg" />
      <div className="activity-card-inner">
        <div className="activity-header">
          <div className="live-badge">
            <span className="live-dot" />
            <span>LIVE PLATFORM ACTIVITY</span>
          </div>
        </div>

        <div className="activity-notifications-list">
          {notifications.map((item, idx) => (
            <figure
              key={item.id || idx}
              className="notification-item animate-pop-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div 
                className="notification-icon-wrapper" 
                style={{ 
                  background: item.gradient,
                  boxShadow: `0 4px 12px ${item.shadow}`
                }}
              >
                {item.icon}
              </div>
              <div className="notification-content">
                <div className="notification-meta font-medium">
                  <span className="notification-title">{item.name}</span>
                  <span className="notification-bullet">·</span>
                  <span className="notification-timestamp">{item.time}</span>
                </div>
                <p className="notification-description">{item.description}</p>
              </div>
            </figure>
          ))}
        </div>

        <div className="activity-bottom-fade" />
      </div>
    </div>
  );
};

export default AnimatedActivityList;
