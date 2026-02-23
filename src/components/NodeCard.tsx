import { Html } from "@react-three/drei"
import { useMemo } from "react"
import { useThree } from "@react-three/fiber"
import type { Project } from "../data/projects"

export default function NodeCard({
  project,
  onClose,
  onOpenDetail,
}: {
  project: Project
  onClose: () => void
  onOpenDetail?: (project: Project) => void
}) {
  const [x, y, z] = project.position
  const { size } = useThree()
  const isCompact = size.width < 720
  const tag = project.type === "core" ? "CORE NODE" : "PROJECT"
  const styles = useMemo(() => {
    const rgb = hexToRgb(project.color) ?? { r: 0, g: 245, b: 255 }
    return buildStyles(rgb, isCompact)
  }, [project.color, isCompact])

  const offset = isCompact ? [0, 1.05, 0] : [1.2, 0.6, 0]

  return (
    <Html
      position={[x + offset[0], y + offset[1], z + offset[2]]}
      center
      style={{ pointerEvents: "auto" }}
      // ✅ transform/occlude は使わない（巨大化＆灰色メッシュ回避）
    >
      <div className="node-card" style={styles.card}>
        <div style={styles.grid} />
        <div style={styles.topGlow} />
        <div style={styles.cornerTL} />
        <div style={styles.cornerBR} />

        <div style={styles.titleRow}>
          <div>
            <div style={styles.title}>{project.name}</div>
            <div style={styles.metaRow}>
              <span style={styles.chip}>{tag}</span>
              <span style={styles.idText}>ID {String(project.id).padStart(2, "0")}</span>
            </div>
          </div>
          <button style={styles.close} onClick={onClose} aria-label="close">
            ×
          </button>
        </div>

        {project.description && <div style={styles.desc}>{project.description}</div>}

        {project.stack && (
          <div style={styles.stack}>
            <span style={styles.label}>STACK</span>
            <span style={styles.value}>{project.stack}</span>
          </div>
        )}

        <div style={styles.actions}>
          {onOpenDetail && (
            <button
              style={styles.detailButton}
              onClick={() => onOpenDetail(project)}
              aria-label="open detail"
            >
              DETAIL
            </button>
          )}
          {project.link && (
            <a style={styles.link} href={project.link} target="_blank" rel="noreferrer">
              OPEN ↗
            </a>
          )}
        </div>
      </div>
    </Html>
  )
}

type Rgb = { r: number; g: number; b: number }

function hexToRgb(hex: string): Rgb | null {
  const normalized = hex.replace("#", "").trim()
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16)
    const g = parseInt(normalized[1] + normalized[1], 16)
    const b = parseInt(normalized[2] + normalized[2], 16)
    return { r, g, b }
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16)
    const g = parseInt(normalized.slice(2, 4), 16)
    const b = parseInt(normalized.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

function rgba(rgb: Rgb, a: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
}

function buildStyles(rgb: Rgb, isCompact: boolean) {
  const accentSoft = rgba(rgb, 0.12)
  const accentMid = rgba(rgb, 0.5)
  const accentStrong = rgba(rgb, 0.85)
  const accentGlow = rgba(rgb, 0.2)

  const card: React.CSSProperties = {
    width: isCompact ? "min(280px, 78vw)" : 300,
    padding: "16px 16px 14px",
    color: "white",
    background: `linear-gradient(140deg, ${accentSoft}, rgba(4, 8, 14, 0.88))`,
    border: `1px solid ${accentMid}`,
    borderRadius: 12,
    backdropFilter: "blur(10px)",
    boxShadow: `0 0 28px ${accentGlow}, inset 0 0 18px ${rgba(rgb, 0.1)}`,
    fontFamily: "var(--font-body)",
    position: "relative",
    overflow: "hidden",
  }

  const grid: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(${rgba(rgb, 0.12)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(
      rgb,
      0.12
    )} 1px, transparent 1px)`,
    backgroundSize: "22px 22px",
    opacity: 0.25,
    pointerEvents: "none",
  }

  const topGlow: React.CSSProperties = {
    position: "absolute",
    left: 14,
    right: 14,
    top: 10,
    height: 2,
    background: `linear-gradient(90deg, ${rgba(rgb, 0)}, ${accentStrong}, ${rgba(
      rgb,
      0
    )})`,
    boxShadow: `0 0 12px ${accentStrong}`,
    pointerEvents: "none",
  }

  const cornerTL: React.CSSProperties = {
    position: "absolute",
    top: 8,
    left: 8,
    width: 18,
    height: 18,
    borderTop: `2px solid ${rgba(rgb, 0.8)}`,
    borderLeft: `2px solid ${rgba(rgb, 0.8)}`,
    pointerEvents: "none",
  }

  const cornerBR: React.CSSProperties = {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 18,
    height: 18,
    borderBottom: `2px solid ${rgba(rgb, 0.7)}`,
    borderRight: `2px solid ${rgba(rgb, 0.7)}`,
    pointerEvents: "none",
  }

  const titleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  }

  const title: React.CSSProperties = {
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: 0.7,
    color: accentStrong,
    fontFamily: "var(--font-title)",
    textShadow: `0 0 12px ${rgba(rgb, 0.45)}`,
  }

  const metaRow: React.CSSProperties = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
  }

  const chip: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: 1.3,
    padding: "4px 7px",
    borderRadius: 999,
    border: `1px solid ${accentMid}`,
    color: accentStrong,
    background: rgba(rgb, 0.08),
  }

  const idText: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: 1.1,
    opacity: 0.75,
  }

  const desc: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.92,
    lineHeight: 1.45,
    marginBottom: 12,
  }

  const stack: React.CSSProperties = {
    display: "flex",
    gap: 8,
    alignItems: "baseline",
    marginBottom: 12,
    paddingTop: 8,
    borderTop: `1px dashed ${rgba(rgb, 0.25)}`,
  }

  const label: React.CSSProperties = {
    fontSize: 10,
    opacity: 0.7,
    letterSpacing: 1.2,
    fontFamily: "var(--font-title)",
  }

  const value: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.9,
  }

  const link: React.CSSProperties = {
    fontSize: 12,
    textDecoration: "none",
    color: accentStrong,
    border: `1px solid ${accentMid}`,
    padding: "8px 12px",
    borderRadius: 10,
    background: `linear-gradient(90deg, ${rgba(rgb, 0.18)}, ${rgba(rgb, 0.04)})`,
  }

  const actions: React.CSSProperties = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  }

  const detailButton: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: 0.6,
    borderRadius: 10,
    border: `1px solid ${accentMid}`,
    padding: "8px 12px",
    background: rgba(rgb, 0.1),
    color: accentStrong,
    cursor: "pointer",
  }

  const close: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 10,
    border: `1px solid ${rgba(rgb, 0.35)}`,
    background: rgba(rgb, 0.08),
    color: "white",
    cursor: "pointer",
  }

  return {
    card,
    grid,
    topGlow,
    cornerTL,
    cornerBR,
    titleRow,
    title,
    metaRow,
    chip,
    idText,
    desc,
    stack,
    label,
    value,
    link,
    close,
    actions,
    detailButton,
  }
}
