import React from "react";

export default function SectionTitle({ number, eyebrow, title }) {
  return (
    <div className="section-title">
      <div className="section-number">{number}</div>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
    </div>
  );
}