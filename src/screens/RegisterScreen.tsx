import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  useColorScheme,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"
import InputPaper from "../components/InputPaper"
import { useState, useEffect } from "react"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import ButtonPaper from "../components/ButtonPaper"
import useRegister from "../hooks/api/useRegister"
import useVerifyActive from "../hooks/api/useVerifyActive"
import useFetchOtp from "../hooks/api/useOtp"
import { CommonActions, useNavigation } from "@react-navigation/native"
import navigationRoutes from "../routes/navigationRoutes"
import HeaderImage from "../components/HeaderImage"
import {
  logo,
  logoDark,
  productHeader,
  productHeaderDark,
} from "../resources/images"
import SmsRetrieverModule from "react-native-sms-retriever"
import { Text } from "react-native-paper"

/**
 * 
 * @deprecated RegisterScreen
 */
const RegisterScreen = () => {
  const navigation = useNavigation()
  const theme = usePaperColorScheme()
  const colorScheme = useColorScheme()

  const [mobileNo, setMobileNo] = useState<string>(() => "")
  const [otp, setOtp] = useState<string>(() => "")
  const [next, setNext] = useState<boolean>(() => false)
  const [otpSent, setOtpSent] = useState<boolean>(() => false)
  const [timer, setTimer] = useState<number>(() => 30)

  const [fetchedOtp, setFetchedOtp] = useState<string>(() => "")

  const { register } = useRegister()
  const { verifyActive } = useVerifyActive()
  const { getOtp } = useFetchOtp()

  const openPhoneHintModal = async () => {
    if (Platform.OS === "android") {
      try {
        const phoneNumber = await SmsRetrieverModule.requestPhoneNumber()
        console.log(phoneNumber, "PhoneNumber")
        const formattedPhoneNumber = phoneNumber?.slice(3, 13)
        setMobileNo(formattedPhoneNumber)
        handleRegister(formattedPhoneNumber)
      } catch (error) {
        console.log(JSON.stringify(error))
        // ToastAndroid.show("Put Your Phone Number.", ToastAndroid.SHORT)
      }
    }
  }

  const handleRegister = async (mobileNo: string) => {
    if (mobileNo.length === 0) {
      ToastAndroid.show("Enter mobile number!", ToastAndroid.SHORT)
      return
    }
    try {
      const registerResponse = await register(mobileNo)
      console.log("registeredData", registerResponse)

      if (registerResponse?.status === 0) {
        Alert.alert("Message", "Mobile No is not Registered.")
        setMobileNo("")
        return
      }

      if (registerResponse?.status === 1) {
        const verifyResponse = await verifyActive(mobileNo)
        console.log("verifyActiveData", verifyResponse)

        if (verifyResponse?.status === -1) {
          Alert.alert("Message", "Mobile No is already in use.")
          setMobileNo("")
          return
        }
        handleFetchOtp().then(() => {
          setNext(!next)
        })
      }
    } catch (error) {
      ToastAndroid.show("Some error on server.", ToastAndroid.SHORT)
    }
  }

  const handleFetchOtp = async () => {
    const otpResponse = await getOtp(mobileNo)
    console.log("otpData", otpResponse)

    Alert.alert("Your OTP is", otpResponse?.data)
    setFetchedOtp(otpResponse?.data)

    setOtpSent(true)
  }

  const handleOtpMatch = () => {
    if (otp === fetchedOtp) {
      console.log("OTP MATCHED...")
      navigation.dispatch(
        CommonActions.navigate({
          name: navigationRoutes.createPinScreen,
          params: {
            mobile_no: mobileNo,
          },
        }),
      )
    } else {
      console.log("WRONG OTP!!!")
      setOtp("")
      Alert.alert("Error", "OTP doesn't match.")
      return
    }
  }

  useEffect(() => {
    openPhoneHintModal()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpSent) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 0) {
            clearInterval(interval)
            setOtpSent(false)
            return 30 // Reset the timer to 30 seconds
          } else {
            return prevTimer - 1
          }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpSent])

  const handleResendOtp = () => {
    handleFetchOtp()
    setTimer(30) // Reset the timer
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
              {!next ? "Register" : "Your OTP"}
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
              <View>
                {!next && (
                  <View
                    style={{
                      paddingHorizontal: normalize(40),
                      width: "100%",
                      flexDirection: "column",
                      gap: 20,
                    }}>
                    <View>
                      <InputPaper
                        label="Mobile Number"
                        value={mobileNo}
                        onChangeText={(mob: string) => setMobileNo(mob)}
                        // customStyle={{ marginBottom: 20 }}
                        leftIcon="account-circle-outline"
                        keyboardType="phone-pad"
                        autoFocus
                      />
                    </View>
                    <View>
                      <ButtonPaper
                        mode="contained"
                        buttonColor={theme.colors.tertiary}
                        onPress={() => handleRegister(mobileNo)}
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
                        placeholder={
                          <Text
                            style={{
                              fontSize: normalize(25),
                              color: theme.colors.onSurface,
                              textAlign: "center",
                            }}>
                            ◌
                          </Text>
                        }
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
                              backgroundColor: theme.colors.onPrimaryContainer,
                            }}></View>
                        }
                        maskDelay={1000}
                        password={true}
                        cellStyle={{
                          borderWidth: 1,
                          borderRadius: 5,
                          borderColor: theme.colors.secondary,
                        }}
                        cellStyleFocused={null}
                        value={otp}
                        onTextChange={(otp: string) => setOtp(otp)}
                      />
                    </View>
                    <View
                      style={{
                        // margin: 20,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 15,
                      }}>
                      {/* <View style={{ padding: normalize(25) }}> */}
                      <ButtonPaper
                        mode="contained"
                        buttonColor={theme.colors.tertiary}
                        textColor={theme.colors.onTertiary}
                        onPress={handleOtpMatch}
                        icon="arrow-right">
                        NEXT
                      </ButtonPaper>

                      <ButtonPaper
                        mode="text"
                        // buttonColor={theme.colors.secondaryContainer}
                        textColor={theme.colors.primary}
                        onPress={handleResendOtp}
                        icon="update"
                        disabled={otpSent && timer !== 0}>
                        {otpSent ? `OTP Sent (${timer}s)` : "Resend OTP"}
                      </ButtonPaper>
                      {/* </View> */}
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

export default RegisterScreen

const styles = StyleSheet.create({
  containerBox: {
    // paddingVertical: normalize(40),
    paddingTop: normalize(50),
    height: SCREEN_HEIGHT / 1.8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "space-between",
  },
})
