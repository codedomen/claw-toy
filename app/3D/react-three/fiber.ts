import { Platform } from "react-native"
import * as FiberWeb from "@react-three/fiber"
import * as FiberNative from "@react-three/fiber/native"

// Export the appropriate React Three Fiber entry based on platform (web vs native)
const FiberRuntime = Platform.OS === "web" ? FiberWeb : FiberNative

export default FiberRuntime
// Re-export common types for consumers to import from this runtime wrapper
export type { ThreeElements } from "@react-three/fiber"
