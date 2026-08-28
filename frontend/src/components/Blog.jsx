import React from 'react';
import StaticPageLayout from './StaticPageLayout';
import { PlayCircle } from 'lucide-react';

const allBlogs = [
  {
    id: 1,
    category: "Product Update",
    title: "Introducing Automated Case Summaries 2.0",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    category: "Industry Insights",
    title: "How AI is Reshaping Indian Courts in 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    category: "Legal Tech",
    title: "The Future of Independent Practitioners in India",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    category: "Best Practices",
    title: "5 Prompts to Extract Perfect Contract Clauses",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    category: "Case Study",
    title: "How Desai & Associates Cut Research Time by 80%",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    category: "Constitutional Law",
    title: "Revisiting the Basic Structure Doctrine with AI",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&q=80&w=800",
  }
];

const Blog = (props) => {
  return (
    <StaticPageLayout title="Wakalat AI Blog" {...props}>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Insights on Legal Tech, AI, and the future of law practice in India.
      </p>
      
      <div className="articles-grid">
        {allBlogs.map((blog) => (
          <div key={blog.id} className="article-card">
            <div className="article-image-container">
              <img src={blog.image} alt={blog.title} className="article-image" />
              <div className="article-overlay">
                <PlayCircle size={48} color="#fff" strokeWidth={1.5} className="play-icon" />
                <span style={{ color: '#fff', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.9rem' }}>Read Article</span>
              </div>
            </div>
            <div className="article-content">
              <span className="article-category">{blog.category}</span>
              <h3 className="article-title" style={{ fontSize: '1.2rem' }}>{blog.title}</h3>
              <span className="article-meta">{blog.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
};

export default Blog;
