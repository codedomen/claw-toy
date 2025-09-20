import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useAppTheme } from "@/utils/useAppTheme"
import FiberRuntime from "@/3D/react-three/fiber"
import DreiRuntime from "@/3D/react-three/drei"
import { Level, Sudo, Camera, Cactus, Box } from "./Scene"
import { Asset } from "expo-asset"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { Text } from "@/components"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"

import fontJson from "../../../assets/fonts/gentilis_regular.typeface.json"

export const StartGameScreen = observer(({ navigation }: NativeStackScreenProps<any>) => {
  const { themed } = useAppTheme()
  const [font, setFont] = useState<Font>()
  const [glbModelPath, setGlbModelPath] = useState<string>("")
  const [glbModelTransformedPath, setGlbModelTransformedPath] = useState<string>("")

  useEffect(() => {
    const loadModelUri = async () => {
      setFont(new FontLoader().parse(fontJson))

      const [{ localUri: glbModelPath }] = await Asset.loadAsync(
        require("../../../assets/3dmodels/level-react-draco.glb"),
      )
      setGlbModelPath(glbModelPath ?? "")

      const [{ localUri: glbModelTransformedPath }] = await Asset.loadAsync(
        require("../../../assets/3dmodels/level-react-draco-transformed.glb"),
      )
      setGlbModelTransformedPath(glbModelTransformedPath ?? "")
    }
    loadModelUri()
  }, [])

  if (!font && !glbModelPath && !glbModelTransformedPath)
    return (
      <View>
        <Text text="Loading..." />
      </View>
    )

  return (
    <FiberRuntime.Canvas flat>
      <DreiRuntime.CameraControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.6} />
      <ambientLight intensity={Math.PI / 2} />
      <group scale={20} position={[5, -11, -5]}>
        <Level glbModelPath={glbModelPath} font={font!} />
        <Sudo glbModelPath={glbModelPath} font={font!} />
        <Camera glbModelPath={glbModelPath} font={font!} />
        <Cactus glbModelPath={glbModelPath} font={font!} />
        <Box position={[-0.8, 1.4, 0.4]} scale={0.4} />
        {/*<Model glbModelPath={glbModelTransformedPath} />*/}
      </group>
      <DreiRuntime.Environment preset="city" background blur={1} />
      <DreiRuntime.PerspectiveCamera makeDefault position={[0, 0, 18.5]} />
    </FiberRuntime.Canvas>
  )
})
