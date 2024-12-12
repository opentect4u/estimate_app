import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  useColorScheme,
} from "react-native"
import { Text } from "react-native-paper"
import LinearGradient from "react-native-linear-gradient"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"
import { useState } from "react"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import ButtonPaper from "../components/ButtonPaper"
import useCreatePin from "../hooks/api/useCreatePin"
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { clearStates } from "../utils/clearStates"
import navigationRoutes from "../routes/navigationRoutes"
import HeaderImage from "../components/HeaderImage"
import {
  logo,
  logoDark,
  productHeader,
  productHeaderDark,
} from "../resources/images"

/**
 * 
 * @deprecated CreatePinScreen
 */
const CreatePinScreen = () => {
  const navigation = useNavigation()
  const { params } = useRoute()
  const { mobile_no } = params as { mobile_no: string }

  const theme = usePaperColorScheme()
  const colorScheme = useColorScheme()

  const { createPin } = useCreatePin()

  const [next, setNext] = useState<boolean>(() => false)
  const [pin, setPin] = useState<string>(() => "")
  const [confirmPin, setConfirmPin] = useState<string>(() => "")

  const handleNextPin = () => {
    if (pin.length === 0) {
      ToastAndroid.show("Enter valid PIN.", ToastAndroid.SHORT)
      return
    }
    setNext(!next)
  }

  const handleCreatePin = async () => {
    if (pin !== confirmPin) {
      Alert.alert("Error", "PIN is not matching! Re-Enter PIN.")

      clearStates([setPin, setConfirmPin], () => "")
      setNext(!next)
      return
    }
    let createPinData = await createPin(confirmPin, mobile_no)
    console.log("createPinData", createPinData)

    ToastAndroid.show(
      "You're registered with us successfully.",
      ToastAndroid.SHORT,
    )
    navigation.dispatch(
      CommonActions.navigate({
        name: navigationRoutes.login,
      }),
    )
  }

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 2 }}
          colors={[theme.colors.primary, theme.colors.onPrimary]}
          style={{
            minHeight: SCREEN_HEIGHT,
            height: "auto",
          }}>
          <View style={{ alignItems: "center" }}>
            <HeaderImage
              isBackEnabled
              imgLight={productHeader}
              imgDark={productHeaderDark}
              borderRadius={30}
              blur={10}>
              Create Pin
            </HeaderImage>
          </View>

          <View style={{ padding: normalize(25, "width") }}>
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              colors={[theme.colors.onPrimary, theme.colors.primaryContainer]}
              style={styles.containerBox}>
              <View
                style={{
                  alignSelf: "center",
                }}>
                <Image
                  source={colorScheme === "dark" ? logoDark : logo}
                  style={{ height: 477 / 4.5, width: 384 / 4.5 }}
                />
              </View>

              {!next && (
                <View
                  style={[
                    styles.pinTextContainer,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}>
                  <Text
                    variant="headlineMedium"
                    style={{ textAlign: "center" }}>
                    New Pin
                  </Text>
                </View>
              )}
              {next && (
                <View
                  style={[
                    styles.pinTextContainer,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}>
                  <Text
                    variant="headlineMedium"
                    style={{ textAlign: "center" }}>
                    Confirm Pin
                  </Text>
                </View>
              )}

              <View>
                {!next && (
                  <View
                    style={{
                      paddingHorizontal: normalize(40),
                      width: "100%",
                      flexDirection: "column",
                      gap: 20,
                    }}>
                    <View style={{ alignSelf: "center" }}>
                      <SmoothPinCodeInput
                        autoFocus={true}
                        // placeholder="🙈"
                        placeholder="◌"
                        textStyle={{
                          fontSize: 20,
                          color: theme.colors.primary,
                        }}
                        mask={
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: normalize(30),
                              backgroundColor: theme.colors.primary,
                            }}></View>
                        }
                        maskDelay={1000}
                        password={true}
                        cellStyle={{
                          borderWidth: 1,
                          borderRadius: 5,
                          borderColor: theme.colors.primary,
                        }}
                        cellStyleFocused={null}
                        value={pin}
                        onTextChange={(pin: string) => setPin(pin)}
                      />
                    </View>
                    <View>
                      <ButtonPaper
                        mode="contained"
                        buttonColor={theme.colors.tertiary}
                        onPress={handleNextPin}
                        icon="arrow-right">
                        NEXT
                      </ButtonPaper>
                    </View>
                  </View>
                )}

                {next && (
                  <View
                    style={{
                      paddingHorizontal: normalize(40),
                      width: "100%",
                      flexDirection: "column",
                      gap: 20,
                    }}>
                    <View style={{ alignSelf: "center" }}>
                      <SmoothPinCodeInput
                        autoFocus={true}
                        // placeholder="🙈"
                        placeholder="◌"
                        textStyle={{
                          fontSize: 20,
                          color: theme.colors.primary,
                        }}
                        mask={
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: normalize(30),
                              backgroundColor: theme.colors.primary,
                            }}></View>
                        }
                        maskDelay={1000}
                        password={true}
                        cellStyle={{
                          borderWidth: 1,
                          borderRadius: 5,
                          borderColor: theme.colors.primary,
                        }}
                        cellStyleFocused={null}
                        value={confirmPin}
                        onTextChange={(confirmPin: string) =>
                          setConfirmPin(confirmPin)
                        }
                      />
                    </View>
                    <View
                      style={{
                        // margin: 20,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 15,
                      }}>
                      <ButtonPaper
                        mode="contained"
                        buttonColor={theme.colors.secondaryContainer}
                        textColor={theme.colors.onSecondaryContainer}
                        onPress={handleCreatePin}
                        icon="security">
                        CREATE ACCOUNT
                      </ButtonPaper>
                    </View>
                  </View>
                )}
              </View>
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    justifyContent: "flex-end",
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.onSurface,
                    padding: normalize(5),
                  }}>
                  Powered by, Synergic Softek Solutions Pvt. Ltd.
                </Text>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreatePinScreen

const styles = StyleSheet.create({
  containerBox: {
    paddingTop: normalize(50),
    height: SCREEN_HEIGHT / 1.8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "space-between",
  },

  pinTextContainer: {
    height: normalize(50),
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
  },
})
