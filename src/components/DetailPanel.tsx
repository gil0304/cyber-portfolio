import { useEffect, useState } from "react";
import type { Project } from "../data/projects";
import { getProjectLinks } from "../utils/projectLinks";

type Props = {
  project: Project;
  onClose: () => void;
};

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb | null {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return { r, g, b };
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function rgba(rgb: Rgb, a: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

export default function DetailPanel({ project, onClose }: Props) {
  const images =
    project.images && project.images.length > 0
      ? project.images
      : ["/images/placeholder-cyber.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, images.length - 1);
  const hero = images[safeIndex];
  const canNavigate = images.length > 1;
  const detailText = project.detail ?? project.description ?? "";
  const rgb = hexToRgb(project.color) ?? { r: 0, g: 245, b: 255 };
  const links = getProjectLinks(project);

  const style = {
    ["--accent" as const]: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    ["--accent-soft" as const]: rgba(rgb, 0.18),
    ["--accent-mid" as const]: rgba(rgb, 0.45),
    ["--accent-strong" as const]: rgba(rgb, 0.9),
  } as React.CSSProperties;

  useEffect(() => {
    setActiveIndex(0);
  }, [project.id]);

  useEffect(() => {
    if (!canNavigate) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canNavigate, images.length]);

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div
        className="detail-card"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-header">
          <div>
            <div className="detail-title">{project.name}</div>
            <div className="detail-meta">
              {project.role && (
                <span className="detail-chip">{project.role}</span>
              )}
              {project.year && (
                <span className="detail-chip">{project.year}</span>
              )}
              {project.stack && (
                <span className="detail-chip">{project.stack}</span>
              )}
            </div>
          </div>
          <button className="detail-close" onClick={onClose} aria-label="close">
            ×
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-media">
            <div className="detail-hero">
              <img
                className="detail-image"
                src={hero}
                alt={`${project.name} preview`}
              />
              {canNavigate && (
                <>
                  <button
                    className="detail-nav detail-nav-left"
                    aria-label="previous image"
                    onClick={() =>
                      setActiveIndex(
                        (prev) => (prev - 1 + images.length) % images.length,
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    className="detail-nav detail-nav-right"
                    aria-label="next image"
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % images.length)
                    }
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {canNavigate && (
              <div className="detail-dots" aria-label="image navigation">
                {images.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    className={`detail-dot ${index === safeIndex ? "active" : ""}`}
                    aria-label={`go to image ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            )}

            {canNavigate && (
              <div className="detail-thumbs">
                {images.map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    className={`detail-thumb ${index === safeIndex ? "active" : ""}`}
                    src={src}
                    alt={`${project.name} view ${index + 1}`}
                    loading="lazy"
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="detail-body">
            {detailText && <p className="detail-text">{detailText}</p>}

            {project.highlights && project.highlights.length > 0 && (
              <div className="detail-section">
                <div className="detail-section-title">HIGHLIGHTS</div>
                <ul className="detail-list">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {links.length > 0 && (
              <div className="detail-section">
                <div className="detail-section-title">LINKS</div>
                <div className="detail-links">
                  {links.map((link) => (
                    <a
                      key={`${project.id}-${link.label}-${link.href}`}
                      className="detail-link"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
