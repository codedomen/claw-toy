import { type ThreeElements } from "@/3D/react-three/fiber"
import { useMemo } from "react"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { Font } from "three/examples/jsm/loaders/FontLoader"

type TextProps = ThreeElements["group"] & {
  color?: string
  count: string
  font: Font
}

export default function Text({ color = "white", count, font, ...props }: TextProps) {
  const array = useMemo(() => [...count], [count])

  const geom = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
    (number) => new TextGeometry(number, { font, size: 6, depth: 0.2 }),
  )
  return (
    <group {...props} dispose={null}>
      {array.map((char, index) => (
        <mesh
          position={[-(array.length / 2) * 3.5 + index * 3.5, 0, 0]}
          key={index}
          geometry={geom[parseInt(char)]}
        >
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}
