// Jest setup for Expo/React Native environment

import "@testing-library/jest-native/extend-expect"

// Use modern fake timers to make timers deterministic in tests
jest.useFakeTimers({ legacyFakeTimers: false })

// Mock react-native-reanimated
// See: https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"))

// Mock expo-asset to avoid native lookups during tests
jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: (m: any) => ({ downloadAsync: async () => undefined, name: String(m) }),
  },
}))

// Mock expo-font to bypass font loading
jest.mock("expo-font", () => ({
  loadAsync: async () => undefined,
}))

// Mock expo-linking's createURL used sometimes in navigation
jest.mock("expo-linking", () => ({
  createURL: (p: string) => p,
}))

// Mock react-native-gesture-handler for testing environment
// https://docs.swmansion.com/react-native-gesture-handler/docs/#testing
jest.mock("react-native-gesture-handler", () => require("react-native-gesture-handler/jestSetup"))
