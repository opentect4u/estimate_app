import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native"
import { Text } from "react-native-paper"
import LinearGradient from "react-native-linear-gradient"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"
import { useState } from "react"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import ButtonPaper from "../components/ButtonPaper"
import { CommonActions, useNavigation } from "@react-navigation/native"
import HeaderImage from "../components/HeaderImage"
import { productHeader, productHeaderDark } from "../resources/images"
import { clearStates } from "../utils/clearStates"
import navigationRoutes from "../routes/navigationRoutes"

/**
 * 
 * @deprecated ChangePinScreen
 */
const ChangePinScreen = () => {
  const navigation = useNavigation()

  const theme = usePaperColorScheme()

  const [oldPin, setOldPin] = useState<string>(() => "")
  const [newPin, setNewPin] = useState<string>(() => "")
  const [confirmPin, setConfirmPin] = useState<string>(() => "")

  const TEMP_OLD_PIN = "1234"

  const handleOldPinCheck = () => {
    if (oldPin !== TEMP_OLD_PIN) {
      ToastAndroid.show("Provided Old Pin is wrong!", ToastAndroid.SHORT)
      setOldPin("")
      return false
    }
    return true
  }

  const handleNewPinCheck = () => {
    if (newPin !== confirmPin) {
      ToastAndroid.show(
        "Both Pin must be matched properly.",
        ToastAndroid.SHORT,
      )
      clearStates([setNewPin, setConfirmPin], () => "")
      return false
    }
    return true
  }

  const handleChangePin = () => {
    if (oldPin.length === 0 || newPin.length === 0 || confirmPin.length === 0) {
      ToastAndroid.show("Provide all the fields properly.", ToastAndroid.SHORT)
      clearStates([setOldPin, setNewPin, setConfirmPin], () => "")
      return
    }

    if (!handleOldPinCheck()) return
    if (!handleNewPinCheck()) return

    ToastAndroid.show("Pin Changed Successfully.", ToastAndroid.SHORT)
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
              Change Pin
            </HeaderImage>
          </View>

          <View style={{ justifyContent: "center" }}>
            <View
              style={{
                marginVertical: SCREEN_HEIGHT / 27,
                paddingHorizontal: normalize(0),
                gap: 10,
                alignSelf: "center",
              }}>
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  height: SCREEN_HEIGHT / 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text variant="labelLarge" style={{ textAlign: "center" }}>
                  Old Pin
                </Text>
              </View>
              <SmoothPinCodeInput
                autoFocus={true}
                // placeholder="🙈"
                placeholder="◌"
                textStyle={{
                  fontSize: 20,
                  color: theme.colors.onPrimary,
                }}
                mask={
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: normalize(30),
                      backgroundColor: theme.colors.onPrimaryContainer,
                    }}></View>
                }
                maskDelay={1000}
                password={true}
                cellStyle={{
                  borderBottomWidth: 2,
                  borderColor: theme.colors.onPrimary,
                }}
                cellStyleFocused={null}
                value={oldPin}
                onTextChange={(pin: string) => setOldPin(pin)}
              />

              <View
                style={{
                  backgroundColor: theme.colors.background,
                  height: SCREEN_HEIGHT / 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text variant="labelLarge" style={{ textAlign: "center" }}>
                  New Pin
                </Text>
              </View>
              <SmoothPinCodeInput
                // placeholder="🙈"
                placeholder="◌"
                textStyle={{
                  fontSize: 20,
                  color: theme.colors.onPrimary,
                }}
                mask={
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: normalize(30),
                      backgroundColor: theme.colors.onPrimaryContainer,
                    }}></View>
                }
                maskDelay={1000}
                password={true}
                cellStyle={{
                  borderBottomWidth: 2,
                  borderColor: theme.colors.onPrimary,
                }}
                cellStyleFocused={null}
                value={newPin}
                onTextChange={(pin: string) => setNewPin(pin)}
              />

              <View
                style={{
                  backgroundColor: theme.colors.background,
                  height: SCREEN_HEIGHT / 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text variant="labelLarge" style={{ textAlign: "center" }}>
                  Confirm Pin
                </Text>
              </View>
              <SmoothPinCodeInput
                // placeholder="🙈"
                placeholder="◌"
                textStyle={{
                  fontSize: 20,
                  color: theme.colors.onPrimary,
                }}
                mask={
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: normalize(30),
                      backgroundColor: theme.colors.onPrimaryContainer,
                    }}></View>
                }
                maskDelay={1000}
                password={true}
                cellStyle={{
                  borderBottomWidth: 2,
                  borderColor: theme.colors.onPrimary,
                }}
                cellStyleFocused={null}
                value={confirmPin}
                onTextChange={(pin: string) => setConfirmPin(pin)}
              />
            </View>
            <View style={{ paddingHorizontal: normalize(30) }}>
              <ButtonPaper
                mode="contained"
                buttonColor={theme.colors.secondaryContainer}
                textColor={theme.colors.onSecondaryContainer}
                onPress={handleChangePin}
                icon="security">
                CHANGE PIN
              </ButtonPaper>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChangePinScreen

const styles = StyleSheet.create({})
