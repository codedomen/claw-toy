/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { ComponentProps } from "react"
import * as Application from "expo-application"
import { Applications } from "@/models/Applications"
import { FlickingFingerNavigator } from "@/navigators/FlickingFingerNavigator"
import { ConnectShapesNavigator } from "@/navigators/ConnectShapesNavigator"
import { DemoStackNavigator, DemoStackNavigatorScreens } from "@/navigators/DemoStackNavigator"
import { AppDevelopmentScreen } from "@/screens/AppDevelopmentScreen"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { MetalPongNavigator } from "@/navigators/MetalPongNavigator"

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator()

const APP_DEVELOPMENT = "development"

const MainAppStack = observer(function AppStack() {
  const application = Application.applicationId ?? ""

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={getInitialRouteName(application)}
    >
      {Applications.METAL_PONG === application && (
        <>
          <Stack.Screen name={Applications.METAL_PONG} component={MetalPongNavigator} />
        </>
      )}
      {Applications.FLICKING_FINGER === application && (
        <>
          <Stack.Screen name={Applications.FLICKING_FINGER} component={FlickingFingerNavigator} />
        </>
      )}
      {Applications.CONNECT_SHAPES === application && (
        <>
          <Stack.Screen name={Applications.CONNECT_SHAPES} component={ConnectShapesNavigator} />
        </>
      )}
      {Applications.FINGERS_GYM === application && (
        <>
          <Stack.Screen name={Applications.FINGERS_GYM} component={DemoStackNavigator} />
        </>
      )}
      {!application && (
        <>
          <Stack.Screen name={APP_DEVELOPMENT} component={AppDevelopmentScreen} />
          <Stack.Screen name={Applications.METAL_PONG} component={MetalPongNavigator} />
          <Stack.Screen name={Applications.FLICKING_FINGER} component={FlickingFingerNavigator} />
          <Stack.Screen name={Applications.CONNECT_SHAPES} component={ConnectShapesNavigator} />
          <Stack.Screen name={Applications.FINGERS_GYM} component={DemoStackNavigator} />
        </>
      )}
    </Stack.Navigator>
  )
})

const getInitialRouteName = (application: string): string => {
  switch (application) {
    case Applications.METAL_PONG:
    case Applications.FLICKING_FINGER:
    case Applications.CONNECT_SHAPES:
    case Applications.FINGERS_GYM:
      return application
  }
  return APP_DEVELOPMENT
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const EMPTY_EXIT_ROUTES: string[] = []
const DEMO_EXIT_ROUTES: string[] = [DemoStackNavigatorScreens.WELCOME]
const getExitRoutes = (): string[] => {
  switch (Application.applicationId) {
    case Applications.METAL_PONG:
      return EMPTY_EXIT_ROUTES
    case Applications.FLICKING_FINGER:
      return EMPTY_EXIT_ROUTES
    case Applications.CONNECT_SHAPES:
      return EMPTY_EXIT_ROUTES
    case Applications.FINGERS_GYM:
      return DEMO_EXIT_ROUTES
  }
  return EMPTY_EXIT_ROUTES
}

const getAppStack = () => {
  switch (Application.applicationId) {
    case Applications.METAL_PONG:
      return MetalPongNavigator
    case Applications.FLICKING_FINGER:
      return FlickingFingerNavigator
    case Applications.CONNECT_SHAPES:
      return ConnectShapesNavigator
    case Applications.FINGERS_GYM:
      return DemoStackNavigator
  }
  return MainAppStack
}

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => getExitRoutes().includes(routeName))

  const AppStack = getAppStack()
  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <AppStack />
        </ErrorBoundary>
      </NavigationContainer>
    </ThemeProvider>
  )
})
