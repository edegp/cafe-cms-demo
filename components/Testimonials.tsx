/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";
import { v4 } from "uuid";

const Testimonials = ({ testimonials, className }) => (
  <div className={className}>
    {testimonials.map((testimonial) => (
      <article key={v4()} className="message">
        <div className="message-body">
          {testimonial.quote}
          <br />
          <cite> – {testimonial.author}</cite>
        </div>
      </article>
    ))}
  </div>
);
export default Testimonials;
