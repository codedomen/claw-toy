import { Platform } from "react-native"
import * as DreiWeb from "@react-three/drei"
import * as DreiNative from "@react-three/drei/native"

// Export the appropriate React Three Drei entry based on platform (web vs native)
const DreiRuntime = Platform.OS === "web" ? DreiWeb : DreiNative

export default DreiRuntime
