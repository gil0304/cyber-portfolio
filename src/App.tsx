import { useEffect, useRef, useState } from "react"
import Scene from "./components/Scene"
import type { Project } from "./data/projects"
import { projects } from "./data/projects"
import "./App.css"
import DetailPanel from "./components/DetailPanel"

export default function App() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [detail, setDetail] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [query, setQuery] = useState("")
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const loadingMs = 6200
  const introText = "ぎるのポートフォリオ"
  const bootStyle = { "--boot-duration": `${loadingMs}ms` } as React.CSSProperties
  const contactHref = "ryogo5.0304@gmail.com"
  const socials = [
    { label: "EMAIL", href: contactHref },
    { label: "X / TWITTER", href: "https://x.com/lit_gil" },
    { label: "GITHUB", href: "https://github.com/gil0304" },
  ]
  const isBooting = loading
  const hintActive = showHint && !selected && !detail && !isBooting

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), loadingMs)
    return () => {
      window.clearTimeout(loadingTimer)
    }
  }, [loadingMs])

  useEffect(() => {
    if (isBooting) return
    setShowHint(true)
    const timer = window.setTimeout(() => setShowHint(false), 4200)
    const dismiss = () => setShowHint(false)
    window.addEventListener("pointerdown", dismiss, { once: true })
    window.addEventListener("keydown", dismiss, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("pointerdown", dismiss)
      window.removeEventListener("keydown", dismiss)
    }
  }, [isBooting])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (detail) {
          setDetail(null)
        } else if (selected) {
          setSelected(null)
        }
        return
      }

      if (detail) return

      const numeric = Number.parseInt(event.key, 10)
      if (Number.isNaN(numeric)) return
      if (numeric < 1 || numeric > 9) return
      const target = projects[numeric - 1]
      if (target) {
        setSelected(target)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [detail, selected])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!selected || detail) return
      pointerStartRef.current = { x: event.clientX, y: event.clientY }
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!selected || detail) return
      if (!pointerStartRef.current) return
      const dx = event.clientX - pointerStartRef.current.x
      const dy = event.clientY - pointerStartRef.current.y
      pointerStartRef.current = null
      if (Math.hypot(dx, dy) > 6) return

      const target = event.target as HTMLElement | null
      if (!target) return
      if (target.closest(".node-card") || target.closest(".hud-card")) return
      if (target.closest(".detail-card")) return
      setSelected(null)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("pointerup", onPointerUp)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("pointerup", onPointerUp)
    }
  }, [selected, detail])

  return (
    <div className="app">
      <Scene
        selected={selected}
        setSelected={setSelected}
        onOpenDetail={(project) => setDetail(project)}
        query={query}
        hintActive={hintActive}
      />
      <div className="edge-frame" aria-hidden />
      <div className="hud">
        <div className="hud-card">
          <div className="hud-title">GIL'S PORTFOLIO</div>
          <div className="hud-text">
            作品群をノードネットワークで可視化。ノードをクリックするとフォーカスされ、
            背景クリックで全体に戻ります。
          </div>
          <div className="hud-sub">Drag to orbit. Click a node to explore.</div>
          <div className="hud-search">
            <input
              className="hud-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects..."
              aria-label="search projects"
            />
            {query && (
              <button className="hud-clear" onClick={() => setQuery("")} aria-label="clear search">
                ×
              </button>
            )}
          </div>
          <div className="hud-actions">
            {socials.map((item) => (
              <a
                key={item.label}
                className="hud-button"
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {hintActive && (
        <div className="intro-hint" aria-hidden>
          <div className="intro-card">
            <div className="intro-title">DRAG / CLICK</div>
            <div className="intro-text">ドラッグで視点移動。ノードをクリックして詳細へ。</div>
          </div>
        </div>
      )}
      {selected && !detail && (
        <button className="back-pill" onClick={() => setSelected(null)}>
          Back to Overview
        </button>
      )}
      {detail && <DetailPanel project={detail} onClose={() => setDetail(null)} />}
      {loading && (
        <div className="op-loader" style={bootStyle} role="status" aria-live="polite">
          <div className="op-panel">
            <div className="boot-text boot-type" aria-label={introText}>
              {introText.split("").map((char, index) => (
                <span key={`${char}-${index}`} style={{ "--i": index } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </div>
            <div className="op-title">INITIALIZING</div>
            <div className="op-sub">GIL'S PORTFOLIO</div>
            <div className="op-bar">
              <span />
            </div>
            <div className="op-meta">Boot sequence • Syncing nodes • Rendering space</div>
            <div className="op-grid" />
          </div>
        </div>
      )}
    </div>
  )
}
