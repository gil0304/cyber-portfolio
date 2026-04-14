import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  AdditiveBlending,
  BackSide,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  Vector3,
  MeshStandardMaterial,
} from "three";
import type { Project } from "../data/projects";
import { breathSine } from "../utils/breath";

type Props = {
  project: Project;
  selected: Project | null;
  setSelected: (p: Project | null) => void;
  query: string;
  hintActive: boolean;
};

export default function Node({
  project,
  selected,
  setSelected,
  query,
  hintActive,
}: Props) {
  const { size } = useThree();
  const groupRef = useRef<Group>(null!);
  const coreMeshRef = useRef<Mesh>(null!);
  const haloMatRef = useRef<ShaderMaterial>(null!);
  const clickPulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const hintRingRef = useRef<Mesh>(null!);

  const basePos = useMemo(
    () =>
      new Vector3(
        project.position[0],
        project.position[1],
        project.position[2],
      ),
    [project.position],
  );

  const targetPos = useMemo(() => new Vector3(), []);
  const selectedPos = useMemo(() => new Vector3(), []);
  const dir = useMemo(() => new Vector3(), []);
  const scaleVec = useMemo(() => new Vector3(1, 1, 1), []);
  const nodeScale = useMemo(() => {
    const w = size.width;
    if (w < 520) return 0.8;
    if (w < 720) return 0.88;
    if (w < 1024) return 0.95;
    return 1.0;
  }, [size.width]);
  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;
  const isMatch = !hasQuery || matchesQuery(project, normalizedQuery);
  const matchBoost = hasQuery && isMatch ? 1.35 : 1;

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const isSelected = selected?.id === project.id;
    const breath = 0.92 + 0.08 * breathSine(state.clock.elapsedTime);

    // ベース位置
    targetPos.copy(basePos);

    // 浮遊
    targetPos.y += Math.sin(state.clock.elapsedTime + project.id) * 0.18;

    // 選択ノード近辺は押し出し（core/自分は除外）
    if (selected && project.id !== selected.id && project.id !== 0) {
      selectedPos.set(
        selected.position[0],
        selected.position[1],
        selected.position[2],
      );

      dir.copy(targetPos).sub(selectedPos);
      const dist = Math.max(0.001, dir.length());
      const repelRadius = 3.2;

      if (dist < repelRadius) {
        const strength = (repelRadius - dist) / repelRadius;
        dir.normalize();
        targetPos.addScaledVector(dir, 1.1 * strength * strength);
      }
    }

    // スムーズ移動
    g.position.lerp(targetPos, 0.12);

    clickPulseRef.current = Math.max(0, clickPulseRef.current - delta * 3.6);

    // 選択時ちょい拡大 + クリック反応
    const s =
      (isSelected ? 1.22 : 1.0) *
      nodeScale *
      (1 + clickPulseRef.current * 0.08);
    scaleVec.set(s, s, s);
    g.scale.lerp(scaleVec, 0.15);

    // 自転
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += 0.01;
      const material = coreMeshRef.current.material as MeshStandardMaterial;
      const baseIntensity = (isSelected ? 3.2 : 1.5) * matchBoost * breath;
      material.emissiveIntensity = baseIntensity + clickPulseRef.current * 1.2;
    }

    if (haloMatRef.current) {
      const baseOpacity = (isSelected ? 0.32 : 0.22) * matchBoost * breath;
      const haloOpacity = project.id === 0 ? baseOpacity + 0.04 : baseOpacity;
      haloMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      haloMatRef.current.uniforms.uOpacity.value = haloOpacity;
    }

    if (hintRingRef.current && hintActive && project.id === 0 && !selected) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.08;
      hintRingRef.current.scale.setScalar(pulse);
      const mat = hintRingRef.current.material as MeshBasicMaterial;
      mat.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2.4) * 0.05;
    }
  });

  const isSelected = selected?.id === project.id;
  const isCore = project.id === 0;
  const radius = isCore ? 0.55 : 0.4;
  const haloScale = isSelected ? 1.5 : 1.3;
  const labelStyle = useMemo(
    () => buildLabelStyle(project.color),
    [project.color],
  );
  const showLabel = hovered || (hasQuery && isMatch);

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        clickPulseRef.current = 1;
        setSelected(project);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {showLabel && (
        <Html
          position={[0, radius + 0.45, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div style={labelStyle}>{project.name}</div>
        </Html>
      )}

      {hintActive && project.id === 0 && !selected && (
        <>
          <mesh ref={hintRingRef} scale={1.25}>
            <ringGeometry args={[radius * 1.15, radius * 1.32, 64]} />
            <meshBasicMaterial
              color={project.color}
              transparent
              opacity={0.2}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <Html
            position={[0, radius + 0.9, 0]}
            center
            style={{ pointerEvents: "none" }}
          >
            <div className="center-hint">
              <div className="center-hint-text">CLICK</div>
              <div className="center-hint-arrow">▼</div>
            </div>
          </Html>
        </>
      )}
      {/* ネオン本体 */}
      <mesh ref={coreMeshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={isSelected ? 3.2 : 1.5}
          roughness={0.4}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* 選択時の環境グロー */}
      {isSelected && (
        <mesh scale={2.7}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.08}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* 波打つハロー（Additive） */}
      <mesh scale={haloScale}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          ref={haloMatRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          side={BackSide}
          toneMapped={false}
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: new Color(project.color) },
            uOpacity: { value: 0.22 },
          }}
        />
      </mesh>
    </group>
  );
}

const haloVertexShader = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vRipple;

void main() {
  float wave =
    sin(position.x * 3.6 + uTime * 4.2) * 0.012 +
    sin(position.y * 4.4 - uTime * 3.7) * 0.012 +
    sin(position.z * 3.9 + uTime * 4.6) * 0.012;

  vRipple = 0.6 + 0.4 * sin(uTime * 3.7 + (position.x + position.y + position.z) * 1.4);

  vec3 displaced = position + normal * wave;
  vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

const haloFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vRipple;

void main() {
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);
  float alpha = clamp(uOpacity * (0.35 + 0.85 * fresnel) * vRipple, 0.0, 1.0);
  gl_FragColor = vec4(uColor, alpha);
}
`;

function buildLabelStyle(color: string): CSSProperties {
  const rgb = new Color(color);
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);

  return {
    padding: "6px 10px",
    fontSize: 11,
    letterSpacing: 0.8,
    borderRadius: 10,
    border: `1px solid rgba(${r}, ${g}, ${b}, 0.7)`,
    background: "rgba(2, 6, 12, 0.82)",
    color: `rgba(${r}, ${g}, ${b}, 0.95)`,
    boxShadow: `0 0 12px rgba(${r}, ${g}, ${b}, 0.28)`,
    fontFamily: "var(--font-title)",
    whiteSpace: "nowrap",
  };
}

function matchesQuery(project: Project, query: string) {
  const haystack = [
    project.name,
    project.description,
    project.stack,
    project.link,
    project.detail,
    project.role,
    project.year,
    ...(project.highlights ?? []),
    ...(project.links?.flatMap((link) => [link.label, link.href]) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}
