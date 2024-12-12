import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
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
import { productHeader, productHeaderDark } from "../resources/images"
import SmsRetrieverModule from "react-native-sms-retriever"

const RegisterScreen = () => {
  const navigation = useNavigation()
  const theme = usePaperColorScheme()

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

          {!next && (
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  padding: normalize(20),
                  paddingHorizontal: normalize(30),
                }}>
                <InputPaper
                  label="Mobile Number"
                  value={mobileNo}
                  onChangeText={(mob: string) => setMobileNo(mob)}
                  keyboardType="number-pad"
                  leftIcon="account-arrow-up"
                  autoFocus
                />
              </View>
              <View
                style={{
                  padding: normalize(20),
                  paddingHorizontal: normalize(30),
                }}>
                <ButtonPaper
                  mode="contained"
                  buttonColor={theme.colors.secondaryContainer}
                  textColor={theme.colors.onSecondaryContainer}
                  onPress={() => handleRegister(mobileNo)}
                  icon="arrow-right">
                  NEXT
                </ButtonPaper>
              </View>
            </View>
          )}

          {next && (
            <View style={{ justifyContent: "center" }}>
              <View style={{ padding: normalize(20), alignSelf: "center" }}>
                {/* <InputPaper label='OTP' value={otp} onChangeText={(otp: string) => setOtp(otp)} keyboardType='number-pad' leftIcon='account-arrow-up' maxLength={4} autoFocus /> */}

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
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: theme.colors.onPrimary,
                  }}
                  cellStyleFocused={null}
                  value={otp}
                  onTextChange={(otp: string) => setOtp(otp)}
                  // onBackspace={() => {
                  //   console.warn("hello")
                  // }}
                />
              </View>
              <View style={{ padding: normalize(25) }}>
                <ButtonPaper
                  mode="contained"
                  buttonColor={theme.colors.secondaryContainer}
                  textColor={theme.colors.onSecondaryContainer}
                  onPress={handleOtpMatch}
                  icon="arrow-right">
                  NEXT
                </ButtonPaper>
              </View>
              <View style={{ paddingHorizontal: normalize(30) }}>
                <ButtonPaper
                  mode="text"
                  // buttonColor={theme.colors.secondaryContainer}
                  textColor={theme.colors.onPrimary}
                  onPress={handleResendOtp}
                  icon="update"
                  disabled={otpSent && timer !== 0}>
                  {otpSent ? `OTP Sent (${timer}s)` : "Resend OTP"}
                </ButtonPaper>
              </View>
            </View>
          )}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})
