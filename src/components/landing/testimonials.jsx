import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Bulkin Simons",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore"
    },
    {
      name: "Sarah Johnson",
      text: "The courses are exceptionally well-structured and the instructors are highly knowledgeable. Best investment in my career!"
    },
    {
      name: "Michael Chen",
      text: "Interactive learning experience with practical projects. I landed my dream job after completing the certification!"
    },
    {
      name: "Emma Davis",
      text: "Outstanding platform with comprehensive content. The community support is amazing and really helps with learning."
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="section-title-center">What our students have to say</h2>
        
        <div className="testimonials-wrapper">
          <button onClick={prevTestimonial} className="nav-button">
            <ChevronLeft />
          </button>

          <div className="testimonials-carousel">
            {[0, 1, 2, 3].map((offset) => {
              const index = (activeTestimonial + offset) % testimonials.length;
              const testimonial = testimonials[index];
              return (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-avatar"></div>
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-text">{testimonial.text}</p>
                </div>
              );
            })}
          </div>

          <button onClick={nextTestimonial} className="nav-button">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}