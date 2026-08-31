import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const articles = [
  {
    id: 1,
    category: "Constitutional Law",
    title: "Kesavananda Bharati v. State of Kerala: The Basic Structure Doctrine",
    readTime: "Landmark Judgement",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    category: "Fundamental Rights",
    title: "Maneka Gandhi v. Union of India: Expansion of Article 21",
    readTime: "Supreme Court Analysis",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    category: "Corporate Law",
    title: "Tata Consultancy Services v. Cyrus Mistry: Oppression and Mismanagement",
    readTime: "Tribunal Case Study",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  }
];

const ArticlesSection = () => {
  return (
    <section id="learn" style={{ padding: '8rem 2rem', background: '#fff', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
              <span style={{ fontWeight: 800, color: '#1f2937', display: 'block' }}>Featured <span style={{ fontWeight: 400, color: '#1f2937' }}>Case</span></span>
              <span style={{ fontWeight: 400, color: 'var(--accent-main)', display: 'block' }}>Studies.</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Deep dive into landmark judgements and case analyses.
            </p>
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'transparent', color: 'var(--accent-main)', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
            View all cases <ArrowRight size={20} />
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
