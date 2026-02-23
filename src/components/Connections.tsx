import { Line } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { AdditiveBlending, Mesh, Vector3 } from "three"
import type { Project } from "../data/projects"

type Props = {
  projects: Project[]
  query?: string
}

function Pulse({
  from,
  to,
  speed,
  color,
  phase,
  opacity = 0.85,
}: {
  from: Vector3
  to: Vector3
  speed: number
  color: string
  phase: number
  opacity?: number
}) {
  const meshRef = useRef<Mesh>(null!)
  const dir = useMemo(() => new Vector3().subVectors(to, from), [from, to])

  useFrame((state) => {
    const t = (state.clock.elapsedTime * speed + phase) % 1
    meshRef.current.position.copy(from).addScaledVector(dir, t)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}

function WavyLine({
  from,
  to,
  color,
  opacity,
  phase,
}: {
  from: Vector3
  to: Vector3
  color: string
  opacity: number
  phase: number
}) {
  const segments = 24
  const lineRef = useRef<any>(null!)
  const positions = useMemo(() => new Float32Array(segments * 3), [segments])
  const points = useMemo(() => Array.from({ length: segments }, () => new Vector3()), [segments])
  const dir = useMemo(() => new Vector3(), [])
  const perp = useMemo(() => new Vector3(), [])
  const up = useMemo(() => new Vector3(0, 1, 0), [])
  const alt = useMemo(() => new Vector3(1, 0, 0), [])
  const temp = useMemo(() => new Vector3(), [])

  useFrame((state) => {
    if (!lineRef.current) return
    dir.copy(to).sub(from).normalize()
    const axis = Math.abs(dir.y) > 0.9 ? alt : up
    perp.copy(dir).cross(axis).normalize()

    const time = state.clock.elapsedTime
    const frequency = 8.0
    const amplitude = 0.035
    const speed = 1.6

    for (let i = 0; i < segments; i += 1) {
      const t = i / (segments - 1)
      temp.copy(from).lerp(to, t)
      const wave = Math.sin(t * frequency + time * speed + phase) * amplitude
      temp.addScaledVector(perp, wave)
      const idx = i * 3
      positions[idx] = temp.x
      positions[idx + 1] = temp.y
      positions[idx + 2] = temp.z
    }

    if (lineRef.current?.geometry?.setPositions) {
      lineRef.current.geometry.setPositions(positions)
    }
  })

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1.6}
      transparent
      opacity={opacity}
      toneMapped={false}
    />
  )
}

function matchesQuery(project: Project, query: string) {
  const haystack = [
    project.name,
    project.description,
    project.stack,
    project.detail,
    project.role,
    project.year,
    ...(project.highlights ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

export default function Connections({ projects, query = "" }: Props) {
  const core = projects.find((p) => p.id === 0)
  const normalizedQuery = query.trim().toLowerCase()
  const hasQuery = normalizedQuery.length > 0

  const corePos = useMemo(
    () => new Vector3(core?.position[0] ?? 0, core?.position[1] ?? 0, core?.position[2] ?? 0),
    [core]
  )

  return (
    <>
      {projects
        .filter((p) => p.id !== 0)
        .map((p, i) => {
          const to = new Vector3(p.position[0], p.position[1], p.position[2])
          const isMatch = !hasQuery || matchesQuery(p, normalizedQuery)
          const lineOpacity = hasQuery ? (isMatch ? 0.65 : 0.42) : 0.42
          const pulseOpacity = hasQuery ? (isMatch ? 0.95 : 0.85) : 0.85

          return (
            <group key={p.id}>
              <WavyLine
                from={corePos}
                to={to}
                color="#00f5ff"
                opacity={lineOpacity}
                phase={i * 0.6}
              />

              {/* 光の粒が流れる */}
              <Pulse
                from={corePos}
                to={to}
                speed={0.18}
                color={p.color}
                phase={i * 0.23}
                opacity={pulseOpacity}
              />
              <Pulse
                from={corePos}
                to={to}
                speed={0.22}
                color={"#ffffff"}
                phase={i * 0.41 + 0.3}
                opacity={pulseOpacity * 0.85}
              />
            </group>
          )
        })}
    </>
  )
}
