import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Project } from "../data/projects";

type Props = {
  selected: Project | null;
};

type Mode = "idle" | "focus" | "return";

export default function CameraRig({ selected }: Props) {
  const { camera, controls } = useThree() as any;

  const targetPos = useMemo(() => new Vector3(), []);
  const targetLook = useMemo(() => new Vector3(), []);

  const selectedWorld = useMemo(() => new Vector3(), []);
  const dir = useMemo(() => new Vector3(), []);

  const modeRef = useRef<Mode>("idle");
  const wasSelectedRef = useRef(false);

  // 全体表示の戻り先
  const overviewPos = useMemo(() => new Vector3(0, 0, 8), []);
  const overviewLook = useMemo(() => new Vector3(0, 0, 0), []);

  useEffect(() => {
    if (selected) {
      const [x, y, z] = selected.position;
      selectedWorld.set(x, y, z);
      targetLook.copy(selectedWorld);

      dir.copy(camera.position).sub(selectedWorld);
      if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
      dir.normalize();

      const distance = 4.8;
      const height = 0.4;

      targetPos.copy(selectedWorld).addScaledVector(dir, distance);
      targetPos.y += height;

      modeRef.current = "focus";
      wasSelectedRef.current = true;
      return;
    }

    if (!wasSelectedRef.current) {
      modeRef.current = "idle";
      return;
    }

    targetPos.copy(overviewPos);
    targetLook.copy(overviewLook);
    modeRef.current = "return";
  }, [
    selected,
    camera,
    dir,
    overviewLook,
    overviewPos,
    selectedWorld,
    targetLook,
    targetPos,
  ]);

  useFrame(() => {
    const mode = modeRef.current;
    if (mode === "idle") return;

    if (mode === "focus") {
      camera.position.lerp(targetPos, 0.1);
      if (controls) {
        controls.target.lerp(targetLook, 0.14);
        controls.update();
      } else {
        camera.lookAt(targetLook);
      }
      return;
    }

    if (mode === "return") {
      camera.position.lerp(targetPos, 0.1);

      if (controls) {
        controls.target.lerp(targetLook, 0.12);
        controls.update();
      } else {
        camera.lookAt(targetLook);
      }

      if (camera.position.distanceTo(targetPos) < 0.05) {
        modeRef.current = "idle";
        wasSelectedRef.current = false;
      }
    }
  });

  return null;
}
