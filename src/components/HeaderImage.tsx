import { PropsWithChildren } from "react"
import {
  ImageBackground,
  useColorScheme,
  StyleSheet,
  PixelRatio,
  View,
} from "react-native"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { IconButton, Text } from "react-native-paper"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from "@react-navigation/native"
import ButtonPaper from "./ButtonPaper"
import navigationRoutes from "../routes/navigationRoutes"

type HeaderImageProps = {
  imgLight: { uri: string }
  imgDark?: { uri: string }
  borderRadius?: number
  blur?: number
  isBackEnabled?: boolean
  isBackCustom?: boolean
  backPressed?: () => void
  categoryName?: string
  showProductSearch?: boolean
}

export default function HeaderImage({
  imgLight,
  imgDark,
  borderRadius,
  blur,
  children,
  isBackEnabled,
  isBackCustom = false,
  backPressed,
  categoryName = "",
  showProductSearch = true
}: PropsWithChildren<HeaderImageProps>) {
  const colorScheme = useColorScheme()
  const theme = usePaperColorScheme()

  const navigation = useNavigation()
  return (
    <>
      {isBackEnabled && (
        <View>
          <IconButton
            icon="arrow-left"
            iconColor={theme.colors.onBackground}
            size={20}
            onPress={
              !isBackCustom
                ? () => navigation.dispatch(CommonActions.goBack())
                : () => backPressed()
            }
            style={{
              position: "absolute",
              top: SCREEN_HEIGHT / 40,
              right: SCREEN_WIDTH / 3.2,
              zIndex: 10,
            }}
          />
        </View>
      )}
      <ImageBackground
        imageStyle={{ borderRadius: normalize(borderRadius) }}
        blurRadius={blur}
        source={colorScheme !== "dark" ? imgLight : imgDark}
        style={styles.surface}>
        <Text
          variant="displaySmall"
          style={{ fontFamily: "ProductSans-Medium", textAlign: "center" }}>
          {children}
        </Text>
        {categoryName && <Text variant="bodySmall" style={{
          fontStyle: "italic",
          textDecorationLine: "underline",
        }}>Category: {categoryName}</Text>}
      </ImageBackground>
      {showProductSearch && <View
        style={{
          alignSelf: "center",
          width: "85%",
          marginTop: -9,
          paddingBottom: normalize(10),
        }}>
        <ButtonPaper
          icon="magnify-scan"
          mode="contained"
          buttonColor={theme.colors.purpleContainer}
          onPress={() => navigation.dispatch(
            CommonActions.navigate(
              {
                name: navigationRoutes.categoryProductsScreen,
                params: {
                  category_id: 0,
                  category_name: "All Items",
                  category_photo: ""
                }
              }
            )
          )}
          textColor={theme.colors.onPurpleContainer}>
          SEARCH PRODUCTS
        </ButtonPaper>
      </View>}
    </>
  )
}

const styles = StyleSheet.create({
  surface: {
    margin: normalize(20),
    padding: normalize(25),
    // height: PixelRatio.roundToNearestPixel(200),
    height: SCREEN_HEIGHT / 5,
    borderRadius: normalize(30),
    // width: PixelRatio.roundToNearestPixel(330),
    width: SCREEN_WIDTH / 1.13,
    alignItems: "center",
    justifyContent: "center",
  },
})
