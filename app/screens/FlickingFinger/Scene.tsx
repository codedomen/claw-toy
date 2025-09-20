import { MathUtils, Mesh } from "three"
import { useEffect, useRef, useState } from "react"
import FiberRuntime, { type ThreeElements } from "@/3D/react-three/fiber"
import DreiRuntime from "@/3D/react-three/drei"
import { useSpring, a } from "@react-spring/three"
import { GlbModel } from "@/3D/GlbModel"

export function Level({ glbModelPath }: GlbModel) {
  const { nodes } = DreiRuntime.useGLTF(glbModelPath)
  return (
    <mesh
      geometry={nodes.Level.geometry}
      material={nodes.Level.material}
      position={[-0.38, 0.69, 0.62]}
      rotation={[Math.PI / 2, -Math.PI / 9, 0]}
    />
  )
}

export function Sudo({ glbModelPath }: GlbModel) {
  const { nodes } = DreiRuntime.useGLTF(glbModelPath)
  const [spring, api] = useSpring(
    () => ({ rotation: [Math.PI / 2, 0, 0.29], config: { friction: 40 } }),
    [],
  )
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const wander = () => {
      api.start({
        rotation: [
          Math.PI / 2 + MathUtils.randFloatSpread(2) * 0.3,
          0,
          0.29 + MathUtils.randFloatSpread(2) * 0.2,
        ],
      })
      timeout = setTimeout(wander, (1 + Math.random() * 2) * 800)
    }
    wander()
    return () => clearTimeout(timeout)
  }, [api])
  return (
    <>
      <mesh
        geometry={nodes.Sudo.geometry}
        material={nodes.Sudo.material}
        position={[0.68, 0.33, -0.67]}
        rotation={[Math.PI / 2, 0, 0.29]}
      />
      <a.mesh
        geometry={nodes.SudoHead.geometry}
        material={nodes.SudoHead.material}
        position={[0.68, 0.33, -0.67]}
        {...spring}
      />
    </>
  )
}

export function Camera({ glbModelPath }: GlbModel) {
  const { nodes, materials } = DreiRuntime.useGLTF(glbModelPath)
  const [spring, api] = useSpring(() => ({ "rotation-z": 0, "config": { friction: 40 } }), [])
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const wander = () => {
      api.start({ "rotation-z": Math.random() })
      timeout = setTimeout(wander, (1 + Math.random() * 2) * 800)
    }
    wander()
    return () => clearTimeout(timeout)
  }, [api])
  return (
    <a.group position={[-0.58, 0.83, -0.03]} rotation={[Math.PI / 2, 0, 0.47]} {...spring}>
      <mesh geometry={nodes.Camera.geometry} material={nodes.Camera.material} />
      <mesh geometry={nodes.Camera_1.geometry} material={materials.Lens} />
    </a.group>
  )
}

export function Cactus({ glbModelPath }: GlbModel) {
  const { nodes, materials } = DreiRuntime.useGLTF(glbModelPath)
  return (
    <mesh
      geometry={nodes.Cactus.geometry}
      position={[-0.42, 0.51, -0.62]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <DreiRuntime.MeshWobbleMaterial factor={0.4} map={materials.Cactus.map} />
    </mesh>
  )
}

export function Box({
  scale = 1,
  ...props
}: ThreeElements["mesh"] & { scale?: number }) {
  const ref = useRef<Mesh | null>(null)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  FiberRuntime.useFrame((_state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta
    ref.current.rotation.y += delta
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={(clicked ? 1.5 : 1) * scale}
      onClick={() => click(!clicked)}
      onPointerOver={(event) => {
        event.stopPropagation()
        hover(true)
      }}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  )
}
