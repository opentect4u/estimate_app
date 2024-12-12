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
import InputPaper from "../components/InputPaper"

/**
 * 
 * @deprecated ForgotPinScreen
 */
const ForgotPinScreen = () => {
  const navigation = useNavigation()

  const theme = usePaperColorScheme()

  const [mobileNo, setMobileNo] = useState<string>(() => "")
  const [otp, setOtp] = useState<string>(() => "")

  const [next, setNext] = useState<boolean>(() => false)

  const FETCHED_OTP = "1234"

  const handleForgotPin = () => {
    if (mobileNo.length > 0) {
      setNext(true)
      Alert.alert("Your OTP is", FETCHED_OTP)
    }
  }

  const handleSubmit = () => {
    if (otp !== FETCHED_OTP) {
      ToastAndroid.show("Pin is invalid! Re-enter Pin.", ToastAndroid.SHORT)
      setOtp("")
      return
    }
    ToastAndroid.show("Pin Changed Successfully!", ToastAndroid.SHORT)
    navigation.dispatch(CommonActions.navigate(navigationRoutes.login))
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
              Forgot Pin
            </HeaderImage>
          </View>

          <View style={{ justifyContent: "center" }}>
            {!next && (
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
                    width: SCREEN_WIDTH / 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}>
                  <Text variant="labelLarge" style={{ textAlign: "center" }}>
                    Registered Mobile Number
                  </Text>
                </View>
                <InputPaper
                  value={mobileNo}
                  label={"Mobile Number"}
                  onChangeText={(text: string) => setMobileNo(text)}
                  // customStyle={{ marginBottom: 20 }}
                  leftIcon="account-circle-outline"
                  keyboardType="phone-pad"
                  autoFocus
                />
              </View>
            )}
            {next && (
              <View
                style={{
                  marginVertical: SCREEN_HEIGHT / 27,
                  paddingHorizontal: normalize(0),
                  gap: 10,
                  alignSelf: "center",
                  alignItems: "center",
                }}>
                <View
                  style={{
                    backgroundColor: theme.colors.background,
                    height: SCREEN_HEIGHT / 20,
                    width: SCREEN_WIDTH / 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}>
                  <Text variant="labelLarge" style={{ textAlign: "center" }}>
                    OTP
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
                  value={otp}
                  onTextChange={(pin: string) => setOtp(pin)}
                />
              </View>
            )}
            <View
              style={{
                paddingHorizontal: normalize(40),
                flexDirection: "row",
                justifyContent: "space-around",
              }}>
              {!next && (
                <View style={{ flexGrow: 1 }}>
                  <ButtonPaper
                    mode="contained"
                    buttonColor={theme.colors.secondaryContainer}
                    textColor={theme.colors.onSecondaryContainer}
                    onPress={handleForgotPin}
                    icon="arrow-right">
                    {"GET OTP"}
                  </ButtonPaper>
                </View>
              )}
              {next && (
                <>
                  <ButtonPaper
                    mode="contained"
                    buttonColor={theme.colors.errorContainer}
                    textColor={theme.colors.onErrorContainer}
                    onPress={() => setNext(!next)}
                    icon="arrow-left">
                    {"BACK"}
                  </ButtonPaper>
                  <ButtonPaper
                    mode="contained"
                    buttonColor={theme.colors.secondaryContainer}
                    textColor={theme.colors.onSecondaryContainer}
                    onPress={handleSubmit}
                    icon="arrow-right">
                    {"SUBMIT"}
                  </ButtonPaper>
                </>
              )}
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForgotPinScreen

const styles = StyleSheet.create({})
