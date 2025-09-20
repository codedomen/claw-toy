import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text, Screen } from "@/components"
import { $styles, type ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Applications } from "@/models/Applications"

const metalPongAppIcon = require("../../assets/images/app-icon-flicking-finger.png")
const flickingFingerAppIcon = require("../../assets/images/app-icon-flicking-finger.png")
const connectShapesAppIcon = require("../../assets/images/app-icon-connect-shapes.png")
const fingersGymAppIcon = require("../../assets/images/app-icon-fingers-gym.png")

export const AppDevelopmentScreen = observer(({ navigation }: NativeStackScreenProps<any>) => {
  const { themed } = useAppTheme()

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($root)}>
        <TouchableOpacity
          style={themed($appContainer)}
          onPress={() => navigation.navigate(Applications.METAL_PONG)}
        >
          <Image
            source={metalPongAppIcon}
            style={themed($itemThumbnail)}
            resizeMode={"contain"}
          />
          <Text style={themed($welcomeHeading)} tx="applications:metalPong" preset="heading" />
        </TouchableOpacity>

        <TouchableOpacity
          style={themed($appContainer)}
          onPress={() => navigation.navigate(Applications.FLICKING_FINGER)}
        >
          <Image
            source={flickingFingerAppIcon}
            style={themed($itemThumbnail)}
            resizeMode={"contain"}
          />
          <Text style={themed($welcomeHeading)} tx="applications:flickingFinger" preset="heading" />
        </TouchableOpacity>

        <TouchableOpacity
          style={themed($appContainer)}
          onPress={() => navigation.navigate(Applications.CONNECT_SHAPES)}
        >
          <Image
            source={connectShapesAppIcon}
            style={themed($itemThumbnail)}
            resizeMode={"contain"}
          />
          <Text style={themed($welcomeHeading)} tx="applications:connectShapes" preset="heading" />
        </TouchableOpacity>

        <TouchableOpacity
          style={themed($appContainer)}
          onPress={() => navigation.navigate(Applications.FINGERS_GYM)}
        >
          <Image source={fingersGymAppIcon} style={themed($itemThumbnail)} resizeMode={"contain"} />
          <Text style={themed($welcomeHeading)} tx="applications:fingersGym" preset="heading" />
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: colors.codedomen,
})

const $appContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  marginVertical: spacing.lg,
})

const $itemThumbnail: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 100,
  width: 100,
  marginTop: spacing.sm,
  borderRadius: 50,
})

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
