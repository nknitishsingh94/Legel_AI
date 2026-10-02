import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';

const fallbackTestimonials = [
  {
    id: 1,
    name: "Adv. Rajesh Kumar",
    role: "Senior Partner, Delhi High Court",
    text: "Wakalat AI has completely transformed how our chamber operates. What used to take hours of manual research is now done in seconds. The judgement summaries are incredibly accurate."
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Independent Practitioner",
    text: "As a solo practitioner, I don't have a large team of juniors. Wakalat AI is like having a brilliant associate available 24/7. The drafting tool is a game-changer for my practice."
  },
  {
    id: 3,
    name: "Aman Gupta",
    role: "Managing Director, LegalTech Solutions",
    text: "The Case File Analysis feature is the best I've seen in the Indian market. Uploading a 200-page SLP and getting the key arguments extracted instantly saves us days of work."
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
      {[...Array(testimonial.rating || 5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.5rem', fontStyle: 'italic' }}>
      "{testimonial.text}"
    </p>
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{testimonial.name}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>{testimonial.role}</p>
    </div>
  </div>
);

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from('feedbacks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFeedbacks(data);
        } else {
          setFeedbacks(fallbackTestimonials);
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setFeedbacks(fallbackTestimonials);
      }
    };
    
    fetchFeedbacks();
  }, []);

  const displayData = feedbacks.length > 0 ? feedbacks : fallbackTestimonials;

  const handlePrev = () => {
    setScrollIndex(prev => (prev > 0 ? prev - 1 : displayData.length - 1));
  };

  const handleNext = () => {
    setScrollIndex(prev => (prev < displayData.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="testimonials" style={{ padding: '6rem 0', background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 3rem auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
            <span style={{ fontWeight: 800, color: '#1f2937', display: 'block' }}>Customer <span style={{ fontWeight: 400, color: '#1f2937' }}>Stories.</span></span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '0.5rem', margin: 0 }}>
            Trusted by advocates, corporate legal teams, and law firms across India.
          </p>
        </div>

        {/* Interactive Carousel Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={handlePrev} 
            aria-label="Previous testimonial"
            style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext} 
            aria-label="Next testimonial"
            style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee-content" style={{ transform: `translateX(-${scrollIndex * 380}px)`, transition: 'transform 0.4s ease' }}>
          {displayData.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
          {displayData.map(t => <TestimonialCard key={`${t.id}-duplicate`} testimonial={t} />)}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
