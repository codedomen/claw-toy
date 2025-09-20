import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "@/components"
import { translate } from "@/i18n"
import { useAppTheme } from "@/utils/useAppTheme"
import { $tabBar, $tabBarItem, $tabBarLabel } from "@/navigators/navigationThemedStyle"
import { DemoCommunityScreen, DemoShowroomScreen } from "@/screens/demo"
import { StartGameScreen } from "@/screens/MetalPong/StartGameScreen"

const Tab = createBottomTabNavigator()

const enum MetalPongNavigatorScreens {
  CONFIGURATION = "configuration",
  START_GAME = "startGame",
  TUTORIAL = "tutorial",
}

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 */
export function MetalPongNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name={MetalPongNavigatorScreens.CONFIGURATION}
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: translate("common:configuration"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name={MetalPongNavigatorScreens.START_GAME}
        component={StartGameScreen}
        options={{
          tabBarLabel: translate("common:startGame"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="view" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name={MetalPongNavigatorScreens.TUTORIAL}
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: translate("common:tutorial"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
