import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  Scanline,
} from "@react-three/postprocessing";
import { Vector2 } from "three";

import type { Project } from "../data/projects";
import { projects } from "../data/projects";
import Node from "./Node";
import Connections from "./Connections";
import CameraRig from "./CameraRig";
import NodeCard from "./NodeCard";
import BackgroundBreath from "./BackgroundBreath";

type Props = {
  selected: Project | null;
  setSelected: (p: Project | null) => void;
  onOpenDetail: (p: Project) => void;
  query: string;
  hintActive: boolean;
};

export default function Scene({
  selected,
  setSelected,
  onOpenDetail,
  query,
  hintActive,
}: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={["#050509"]} />

      <BackgroundBreath />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.8} />

      <Stars radius={90} depth={60} count={5000} factor={6} fade />

      <Connections projects={projects} query={query} />

      {projects.map((p) => (
        <Node
          key={p.id}
          project={p}
          selected={selected}
          setSelected={setSelected}
          query={query}
          hintActive={hintActive}
        />
      ))}

      <OrbitControls makeDefault enableZoom={false} enablePan={false} />

      <CameraRig selected={selected} />

      {selected && (
        <NodeCard
          project={selected}
          onClose={() => setSelected(null)}
          onOpenDetail={onOpenDetail}
        />
      )}

      <EffectComposer>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration offset={new Vector2(0.00035, 0.00035)} />
        <Scanline density={1.2} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.18} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
