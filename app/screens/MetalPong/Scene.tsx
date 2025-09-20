import { RigidBody, CuboidCollider, BallCollider } from "@react-three/rapier"
import FiberRuntime from "@/3D/react-three/fiber"
import DreiRuntime from "@/3D/react-three/drei"
import lerp from "lerp"
import clamp from "lodash-es/clamp"
import { useMemo, useRef } from "react"
import type { Group, Material, Mesh, Object3D, Skeleton } from "three"
import { Euler, Quaternion, TextureLoader } from "three"
import type { GLTF } from "three-stdlib/loaders/GLTFLoader"
import { create } from "zustand"
import Text from "./Text"
import { GlbModel } from "@/screens/FlickingFinger/Scene"

type State = {
  api: {
    pong: (velocity: number) => void
    reset: (welcome: boolean) => void
  }
  count: number
  welcome: boolean
}

// const ping = new Audio(pingSound)
export const useGameStore = create<State>((set) => ({
  api: {
    pong(velocity) {
      // ping.currentTime = 0
      // ping.volume = clamp(velocity / 20, 0, 1)
      // ping.play()
      if (velocity > 4) set((state) => ({ count: state.count + 1 }))
    },
    reset: (welcome) => set((state) => ({ count: welcome ? state.count : 0, welcome })),
  },
  count: 0,
  welcome: true,
}))

type PingPongGLTF = GLTF & {
  materials: Record<"foam" | "glove" | "lower" | "side" | "upper" | "wood", Material>
  nodes: Record<"Bone" | "Bone003" | "Bone006" | "Bone010", Object3D> &
    Record<"mesh" | "mesh_1" | "mesh_2" | "mesh_3" | "mesh_4", Mesh> & {
      arm: Mesh & { skeleton: Skeleton }
    }
}

export function Paddle({ glbModelPath, font }: GlbModel) {
  const { nodes, materials } = DreiRuntime.useGLTF(glbModelPath) as unknown as PingPongGLTF
  const { pong } = useGameStore((state) => state.api)
  const welcome = useGameStore((state) => state.welcome)
  const count = useGameStore((state) => state.count)
  const model = useRef<Group>(null)
  const bodyRef = useRef<any>(null)
  const values = useRef<[number, number]>([0, 0])
  const euler = useMemo(() => new Euler(), [])
  const quat = useMemo(() => new Quaternion(), [])

  FiberRuntime.useFrame((state) => {
    values.current[0] = lerp(values.current[0], (state.pointer.x * Math.PI) / 5, 0.2)
    values.current[1] = lerp(values.current[1], (state.pointer.x * Math.PI) / 5, 0.2)
    // Move the kinematic body to follow the pointer
    bodyRef.current?.setNextKinematicTranslation({ x: state.pointer.x * 10, y: state.pointer.y * 5, z: 0 })
    // Rotate around Z according to pointer
    euler.set(0, 0, values.current[1])
    quat.setFromEuler(euler)
    bodyRef.current?.setNextKinematicRotation(quat)

    if (!model.current) return
    model.current.rotation.x = lerp(model.current.rotation.x, welcome ? Math.PI / 2 : 0, 0.2)
    model.current.rotation.y = values.current[0]
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      onCollisionEnter={({ other }) => {
        const v = other.rigidBody?.linvel?.()
        const speed = v ? Math.hypot(v.x, v.y, v.z) : 0
        pong(speed)
      }}
      colliders={false}
    >
      {/* Half-extents [1.7, 0.5, 1.5] correspond to full size [3.4, 1, 3] from cannon */}
      <CuboidCollider args={[1.7, 0.5, 1.5]} friction={0.9} restitution={0.7} />
      <group ref={model} position={[-0.05, 0.37, 0.3]} scale={[0.15, 0.15, 0.15]}>
        <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 2]} count={count.toString()} font={font!} />
        <group rotation={[1.88, -0.35, 2.32]} scale={[2.97, 2.97, 2.97]}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone003} />
          <primitive object={nodes.Bone006} />
          <primitive object={nodes.Bone010} />
          <skinnedMesh
            castShadow
            receiveShadow
            material={materials.glove}
            material-roughness={1}
            geometry={nodes.arm.geometry}
            skeleton={nodes.arm.skeleton}
          />
        </group>
        <group rotation={[0, -0.04, 0]} scale={[141.94, 141.94, 141.94]}>
          <mesh castShadow receiveShadow material={materials.wood} geometry={nodes.mesh.geometry} />
          <mesh castShadow receiveShadow material={materials.side} geometry={nodes.mesh_1.geometry} />
          <mesh castShadow receiveShadow material={materials.foam} geometry={nodes.mesh_2.geometry} />
          <mesh castShadow receiveShadow material={materials.lower} geometry={nodes.mesh_3.geometry} />
          <mesh castShadow receiveShadow material={materials.upper} geometry={nodes.mesh_4.geometry} />
        </group>
      </group>
    </RigidBody>
  )
}

export function Ball({ glbModelPath }: GlbModel) {
  const map = FiberRuntime.useLoader(TextureLoader, glbModelPath)
  return (
    <RigidBody colliders={false} position={[0, 5, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial map={map} />
      </mesh>
      {/* Use a ball collider with radius 0.5 to match the mesh */}
      <BallCollider args={[0.5]} restitution={0.7} friction={0.9} />
    </RigidBody>
  )
}

export function ContactGround() {
  const { reset } = useGameStore((state) => state.api)
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Large thin sensor plane below to detect when the ball falls off */}
      <CuboidCollider
        args={[500, 0.5, 500]}
        position={[0, -10.5, 0]}
        sensor
        onIntersectionEnter={() => reset(true)}
      />
    </RigidBody>
  )
}
