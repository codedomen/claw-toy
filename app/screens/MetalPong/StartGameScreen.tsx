import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useAppTheme } from "@/utils/useAppTheme"
import FiberRuntime from "@/3D/react-three/fiber"
import { Asset } from "expo-asset"
import { Suspense, useEffect, useState } from "react"
import { View } from "react-native"
import { Text } from "@/components"
import { Ball, ContactGround, Paddle, useGameStore } from "@/screens/MetalPong/Scene"
import { Physics } from "@react-three/rapier"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"

import fontJson from "../../../assets/fonts/gentilis_regular.typeface.json"

const style = (welcome: boolean) =>
  ({
    color: "white",
    display: welcome ? "block" : "none",
    fontSize: "1.2em",
    left: 50,
    position: "absolute",
    top: 50,
  }) as const

export const StartGameScreen = observer(({ navigation }: NativeStackScreenProps<any>) => {
  const { themed } = useAppTheme()
  const [font, setFont] = useState<Font>()
  const [glbModelPath, setGlbModelPath] = useState<string>("")
  const [crossPath, setCrossPath] = useState<string>("")

  const welcome = useGameStore((state) => state.welcome)
  const { reset } = useGameStore((state) => state.api)

  useEffect(() => {
    const loadModelUri = async () => {
      setFont(new FontLoader().parse(fontJson))

      const [{ localUri: glbModelPath }] = await Asset.loadAsync(
        require("../../../assets/3dmodels/pingpong.glb"),
      )
      setGlbModelPath(glbModelPath ?? "")

      const [{ localUri: crossPath }] = await Asset.loadAsync(require("../../../assets/cross.jpg"))
      setCrossPath(crossPath ?? "")
    }
    loadModelUri()
  }, [])

  if (!font && !glbModelPath && !crossPath)
    return (
      <View>
        <Text text="Loading..." />
      </View>
    )

  return (
    <>
      <FiberRuntime.Canvas
        camera={{ fov: 50, position: [0, 5, 12] }}
        onPointerMissed={() => welcome && reset(false)}
        shadows
      >
        <color attach="background" args={["#171720"]} />
        <ambientLight intensity={0.5 * Math.PI} />
        <pointLight decay={0} intensity={Math.PI} position={[-10, -10, -10]} />
        <spotLight
          angle={0.3}
          castShadow
          decay={0}
          intensity={Math.PI}
          penumbra={1}
          position={[10, 10, 10]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <Physics gravity={[0, -40, 0]}>
          <mesh position={[0, 0, -10]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshPhongMaterial color="#172017" />
          </mesh>
          <ContactGround />
          {!welcome && <Ball glbModelPath={crossPath} />}
          <Suspense fallback={null}>
            <Paddle glbModelPath={glbModelPath} font={font} />
          </Suspense>
        </Physics>
      </FiberRuntime.Canvas>
      <div style={style(welcome)}>* click anywhere to start</div>
    </>
  )
})
