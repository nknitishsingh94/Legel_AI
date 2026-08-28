import React from 'react';

const testimonialsData = [
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
  },
  {
    id: 4,
    name: "Adv. Neha Singh",
    role: "Corporate Counsel",
    text: "I was skeptical at first, but the depth of the judgement search and the way it understands context rather than just keywords is phenomenal. Highly recommended."
  },
  {
    id: 5,
    name: "Vikram Desai",
    role: "Partner, Desai & Associates",
    text: "Wakalat AI is exactly what the Indian legal ecosystem needed. The platform is intuitive, and the continuous updates to the database give us a huge competitive edge."
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.5rem', fontStyle: 'italic' }}>
      "{testimonial.text}"
    </p>
    <div>
      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{testimonial.name}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>{testimonial.role}</p>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" style={{ padding: '6rem 0', background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
          <span style={{ fontWeight: 800, color: '#1f2937', display: 'block' }}>Customer <span style={{ fontWeight: 400, color: '#1f2937' }}>Stories.</span></span>
        </h2>
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          {/* We render the list twice to create the seamless infinite scroll effect */}
          {testimonialsData.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
          {testimonialsData.map(t => <TestimonialCard key={`${t.id}-duplicate`} testimonial={t} />)}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
