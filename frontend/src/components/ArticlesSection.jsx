import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const articles = [
  {
    id: 1,
    category: "Constitutional Law",
    title: "Kesavananda Bharati v. State of Kerala: The Basic Structure Doctrine",
    readTime: "Landmark Judgement",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    category: "Fundamental Rights",
    title: "Maneka Gandhi v. Union of India: Expansion of Article 21",
    readTime: "Supreme Court Analysis",
    image: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    category: "Corporate Law",
    title: "Tata Consultancy Services v. Cyrus Mistry: Oppression and Mismanagement",
    readTime: "Tribunal Case Study",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
  }
];

const ArticlesSection = () => {
  return (
    <section id="learn" className="articles-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div className="articles-header">
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>
              <span style={{ fontWeight: 800, color: '#1f2937' }}>Featured Case </span>
              <span style={{ fontWeight: 400, color: 'var(--accent-main, #10b981)' }}>Studies.</span>
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              Deep dive into landmark judgements and case analyses.
            </p>
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'transparent', color: 'var(--accent-main, #10b981)', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', padding: 0 }}>
            <span>View all cases</span> <ArrowRight size={18} />
          </button>
        </div>

        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-image-container">
                <img src={article.image} alt={article.title} className="article-image" />
                <div className="article-overlay">
                  <PlayCircle size={48} color="#fff" strokeWidth={1.5} className="play-icon" />
                  <span style={{ color: '#fff', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.9rem' }}>Read Article</span>
                </div>
              </div>
              <div className="article-content">
                <span className="article-category">{article.category}</span>
                <h3 className="article-title">{article.title}</h3>
                <span className="article-meta">{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ArticlesSection;
