import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, Github, ExternalLink, Lock } from "lucide-react";

export default function ProjectCard({ project, featured = false }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`project-card ${project.color} ${featured ? "featured" : ""}`}>
      <div className="project-visual">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.classList.add("no-image");
            }}
          />
        ) : (
          <div className="project-visual-placeholder" data-initials={project.title
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}>
            <span>{project.title
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}</span>
          </div>
        )}
        <div className="project-visual-overlay" />
        {project.private && (
          <span className="private-badge"><Lock size={12} /> Private</span>
        )}
        <span className="project-category-chip">{project.categoryLabel}</span>
      </div>

      <div className="project-body">
        <div className="project-top">
          <span className="project-number">{project.number}</span>
          {featured && <span className="featured-badge">Featured</span>}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.stack.slice(0, 6).map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>

        <div className="project-actions">
          {project.github && (
            <a
              className="project-link"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={15} /> Code
            </a>
          )}
          {project.demo && (
            <a
              className="project-link"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
          {project.details && project.details.length > 0 && (
            <button className="text-button" onClick={() => setOpen(!open)}>
              {open ? "Hide details" : "View details"}{" "}
              <ChevronDown className={open ? "rotated" : ""} size={16} />
            </button>
          )}
        </div>

        {open && project.details && (
          <div className="project-details">
            {project.details.map((d, i) => (
              <div key={i}>
                <span className="check">✓</span> {d}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
