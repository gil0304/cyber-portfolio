import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, BackSide, Color, ShaderMaterial } from "three";
import { breathPulse } from "../utils/breath";

export default function BackgroundBreath() {
  const materialRef = useRef<ShaderMaterial>(null!);

  useFrame((state) => {
    const pulse = breathPulse(state.clock.elapsedTime);
    if (materialRef.current) {
      materialRef.current.uniforms.uPulse.value = pulse;
    }
  });

  return (
    <mesh scale={40} renderOrder={-10}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={BackSide}
        blending={AdditiveBlending}
        toneMapped={false}
        vertexShader={backgroundVertex}
        fragmentShader={backgroundFragment}
        uniforms={{
          uColor: { value: new Color("#00f5ff") },
          uPulse: { value: 0.5 },
        }}
      />
    </mesh>
  );
}

const backgroundVertex = `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

const backgroundFragment = `
uniform vec3 uColor;
uniform float uPulse;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.4);
  float glow = mix(0.12, 0.4, fresnel);
  float pulse = mix(0.35, 1.0, uPulse);
  float alpha = glow * pulse * 0.22;
  gl_FragColor = vec4(uColor, alpha);
}
`;
