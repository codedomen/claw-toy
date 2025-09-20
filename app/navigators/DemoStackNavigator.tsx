import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { useAppTheme } from "@/utils/useAppTheme"
import { DemoNavigator } from "@/navigators/DemoNavigator"
import { LoginScreen, WelcomeScreen } from "@/screens/demo"

const Stack = createNativeStackNavigator()

export const enum DemoStackNavigatorScreens {
  WELCOME = "Welcome",
  LOGIN = "Login",
  DEMO = "Demo",
}

export const DemoStackNavigator = observer(function DemoStack() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

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
      initialRouteName={
        isAuthenticated ? DemoStackNavigatorScreens.WELCOME : DemoStackNavigatorScreens.LOGIN
      }
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name={DemoStackNavigatorScreens.WELCOME} component={WelcomeScreen} />
          <Stack.Screen name={DemoStackNavigatorScreens.DEMO} component={DemoNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name={DemoStackNavigatorScreens.LOGIN} component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  )
})
