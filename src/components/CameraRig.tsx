import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"
import type { Project } from "../data/projects"

type Props = {
  selected: Project | null
}

type Mode = "idle" | "focus" | "return"

export default function CameraRig({ selected }: Props) {
  const { camera, controls } = useThree() as any

  const targetPos = useMemo(() => new Vector3(), [])
  const targetLook = useMemo(() => new Vector3(), [])

  const selectedWorld = useMemo(() => new Vector3(), [])
  const dir = useMemo(() => new Vector3(), [])

  const modeRef = useRef<Mode>("idle")
  const wasSelectedRef = useRef(false)

  // ここが “全体表示” の戻り先（好きに調整してOK）
  const overviewPos = useMemo(() => new Vector3(0, 0, 8), [])
  const overviewLook = useMemo(() => new Vector3(0, 0, 0), [])

  useEffect(() => {
    if (selected) {
      // ✅ 選択時：押したノードを中心にフォーカス
      const [x, y, z] = selected.position
      selectedWorld.set(x, y, z)
      targetLook.copy(selectedWorld)

      dir.copy(camera.position).sub(selectedWorld)
      if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1)
      dir.normalize()

      const distance = 4.8
      const height = 0.4

      targetPos.copy(selectedWorld).addScaledVector(dir, distance)
      targetPos.y += height

      modeRef.current = "focus"
      wasSelectedRef.current = true
      return
    }

    if (!wasSelectedRef.current) {
      // ✅ 未選択時は干渉しない
      modeRef.current = "idle"
      return
    }

    // ✅ 解除時：全体表示へ “戻すだけ”
    targetPos.copy(overviewPos)
    targetLook.copy(overviewLook)
    modeRef.current = "return"
  }, [selected, camera, dir, overviewLook, overviewPos, selectedWorld, targetLook, targetPos])

  useFrame(() => {
    const mode = modeRef.current
    if (mode === "idle") return

    if (mode === "focus") {
      // 選択中は追従し続ける
      camera.position.lerp(targetPos, 0.10)
      if (controls) {
        controls.target.lerp(targetLook, 0.14)
        controls.update()
      } else {
        camera.lookAt(targetLook)
      }
      return
    }

    if (mode === "return") {
      // ✅ 戻るアニメーションだけする
      camera.position.lerp(targetPos, 0.10)

      // 戻る時は一旦全体を見る（ここは“戻る最中だけ”固定）
      if (controls) {
        controls.target.lerp(targetLook, 0.12)
        controls.update()
      } else {
        camera.lookAt(targetLook)
      }

      // ✅ 十分近づいたら停止＝以後自由操作
      if (camera.position.distanceTo(targetPos) < 0.05) {
        modeRef.current = "idle"
        wasSelectedRef.current = false
      }
    }
  })

  return null
}
