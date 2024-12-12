import { useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  useColorScheme,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Keyboard,
  Alert,
  AppState,
} from "react-native"
import { withTheme, Text, TouchableRipple } from "react-native-paper"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import { usePaperColorScheme } from "../theme/theme"
import InputPaper from "../components/InputPaper"
import ButtonPaper from "../components/ButtonPaper"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { CommonActions, useNavigation } from "@react-navigation/native"
import SmsRetriever from "react-native-sms-retriever"
import navigationRoutes from "../routes/navigationRoutes"
import { AppStore } from "../context/AppContext"
import LinearGradient from "react-native-linear-gradient"
import { logo, logoDark, flower2, flower2Dark } from "../resources/images"
import { ezetapStorage, loginStorage } from "../storage/appStorage"
import InvertedTriangle from "../components/InvertedTriangle"
import { AppStoreContext } from "../models/custom_types"
import useUpdateLoginFlag from "../hooks/api/useUpdateLoginFlag"
import { UpdateLoginFlagCredentials } from "../models/api_types"
// import RNEzetapSdk from "react-native-ezetap-sdk"

function LoginScreen() {
  const navigation = useNavigation()

  const {
    handleLogin,
    // loginDataMessage,
    // otp: fetchedOtp,
    // setOtp: setFetchedOtp,
    // setIsLogin,
  } = useContext<AppStoreContext>(AppStore)

  const theme = usePaperColorScheme()
  const colorScheme = useColorScheme()

  const { updateLoginFlag } = useUpdateLoginFlag()

  const [loginText, setLoginText] = useState<string>(() => "")
  const [passwordText, setPasswordText] = useState<string>(() => "")
  const [next, setNext] = useState<boolean>(() => false)
  // const [otpSent, setOtpSent] = useState<boolean>(() => false)
  // const [timer, setTimer] = useState<number>(() => 300)

  // const openPhoneHintModal = async () => {
  //   if (Platform.OS === "android") {
  //     try {
  //       await SmsRetriever.requestPhoneNumber()
  //         .then(phoneNumber => {
  //           console.log(phoneNumber, "PhoneNumber")
  //           setLoginText(phoneNumber?.slice(3, 13))
  //           handleLogin(phoneNumber?.slice(3, 13))
  //           setOtpSent(true)
  //         })
  //         .then(() => {
  //           setNext(true)
  //         })
  //         .catch(err => {
  //           // ToastAndroid.show("Put Your Phone Number.", ToastAndroid.SHORT)
  //         })
  //     } catch (error) {
  //       console.log(JSON.stringify(error))
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (!loginStorage.contains("login-data")) {
  //     openPhoneHintModal()
  //   }
  // }, [])

  const onChangeCustomerMobileNumber = (mobile: string) => {
    if (/^\d*$/.test(mobile)) {
      setLoginText(mobile)
    }
  }

  // useEffect(() => {
  //   if (loginText.length === 10) {
  //     handleLogin(loginText)
  //     setNext(!next)
  //     // if (fetchedOtp === -1) {
  //     //   setNext(next)
  //     //   setLoginText(() => "")
  //     // } else {
  //     //   console.log("RRRRRRRRRRR", fetchedOtp)
  //     //   setNext(!next)
  //     // }
  //   }
  // }, [loginText])

  // const handleLoginAfterGettingOtp = () => {
  //   if (parseInt(passwordText) === fetchedOtp) {
  //     const creds: UpdateLoginFlagCredentials = {
  //       user_id: loginText
  //     }
  //     updateLoginFlag(creds).then(res => {
  //       if (res.suc === 1) {
  //         setIsLogin(true)
  //       } else {
  //         ToastAndroid.show("Login Flag not updated.", ToastAndroid.SHORT)
  //         return
  //       }
  //     }).catch(err => {
  //       ToastAndroid.show("Error while updating Login Flag!", ToastAndroid.SHORT)
  //     })
  //   } else {
  //     setIsLogin(false)
  //     Alert.alert("Message", "Provided OTP is wrong! Re-enter OTP.")
  //     setPasswordText("")
  //   }
  // }

  // useEffect(() => {
  //   if (passwordText.length === 4) {
  //     Keyboard.dismiss()
  //     handleLoginAfterGettingOtp()
  //   }
  // }, [passwordText])

  // useEffect(() => {
  //   let interval: NodeJS.Timeout
  //   if (otpSent) {
  //     interval = setInterval(() => {
  //       setTimer(prevTimer => {
  //         if (prevTimer === 0) {
  //           clearInterval(interval)
  //           setOtpSent(false)
  //           // setFetchedOtp(-1)
  //           return 300 // Reset the timer to 300 seconds
  //         } else {
  //           return prevTimer - 1
  //         }
  //       })
  //     }, 1000)
  //   }
  //   return () => clearInterval(interval)
  // }, [otpSent])

  // const handleResendOtp = () => {
  //   setOtpSent(true)
  //   handleLogin(loginText)
  //   setTimer(300) // Reset the timer
  // }


  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  // const initRazorpay = async () => {
  //   var withAppKey =
  //     '{"userName":' +
  //     "9903044748" +
  //     ',"demoAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","prodAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","merchantName":"SYNERGIC_SOFTEK_SOLUTIONS","appMode":"DEMO","currencyCode":"INR","captureSignature":false,"prepareDevice":false}'
  //   var response = await RNEzetapSdk.initialize(withAppKey)
  //   console.log(response)
  //   // var jsonData = JSON.parse(response)
  //   // setRazorpayInitializationJson(jsonData)
  //   ezetapStorage.set("ezetap-initialization-json", response)
  // }

  // const init = async () => {
  //   console.log(
  //     "PPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
  //     ezetapStorage.contains("ezetap-initialization-json"),
  //     ezetapStorage.getString("ezetap-initialization-json"),
  //   )
  //   // if (!ezetapStorage.contains("ezetap-initialization-json")) {
  //   await initRazorpay()

  //   var res = await RNEzetapSdk.prepareDevice()
  //   console.warn("RAZORPAY===PREPARE DEVICE", res)
  //   // }
  // }

  // useEffect(() => {
  //   init()
  // }, [])

  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === 'background') {
  //       console.log('App has gone to the background!');
  //       // Add your event handling code here
  //     } else if (nextAppState === 'inactive') {
  //       console.log('App is closing!');

  //       ezetapStorage.clearAll()
  //     }
  //   };

  //   const subscription = AppState.addEventListener('change', handleAppStateChange);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);


  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ImageBackground
          resizeMode="cover"
          blurRadius={10}
          source={colorScheme === "dark" ? flower2Dark : flower2}
          style={[
            styles.loginWrapper,
            { backgroundColor: theme.colors.background },
          ]}>
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={[theme.colors.onPrimary, theme.colors.primaryContainer]}
            style={styles.containerBox}>
            {/* <View
              style={{
                alignSelf: "center",
              }}>
              <Image
                source={colorScheme === "dark" ? logoDark : logo}
                style={{ height: 477 / 4.5, width: 384 / 4.5 }}
              />
            </View> */}
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
                      value={loginText}
                      label={"Mobile Number"}
                      onChangeText={onChangeCustomerMobileNumber}
                      customStyle={{ backgroundColor: theme.colors.onPrimary }}
                      leftIcon="account-circle-outline"
                      keyboardType="phone-pad"
                      autoFocus
                    />
                  </View>
                  <View>
                    <InputPaper
                      value={passwordText}
                      label={"Password"}
                      onChangeText={(e: string) => setPasswordText(e)}
                      customStyle={{ backgroundColor: theme.colors.onPrimary }}
                      leftIcon="form-textbox-password"
                      keyboardType="default"
                      secureTextEntry
                    />
                  </View>
                  <View>
                    <ButtonPaper
                      mode="contained"
                      onPress={() => {
                        if (loginText !== "" && passwordText !== "") {
                          // setNext(!next)
                          handleLogin(loginText, passwordText)
                          // setOtpSent(true)
                        } else {
                          ToastAndroid.show("Enter username or password properly.", ToastAndroid.SHORT)
                        }
                      }}
                      icon="arrow-right">
                      LOGIN
                    </ButtonPaper>
                  </View>

                  {/* <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.primary }}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => (navigation.dispatch(
                      CommonActions.navigate({
                        name: navigationRoutes.register,
                      }))
                    )}>
                      <Text style={{
                        textTransform: 'uppercase',
                        color: theme.colors.green,
                        textDecorationLine: 'underline'
                      }}>
                        Create new account
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
              )}

              {/* {next && (
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
                      value={passwordText}
                      onTextChange={(text: string) => setPasswordText(text)}
                    />
                  </View>
                  <View
                    style={{
                      // margin: 20,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 15,
                    }}>
                    <ButtonPaper
                      mode="contained"
                      buttonColor={theme.colors.error}
                      textColor={theme.colors.onError}
                      onPress={() => {
                        setNext(!next)
                      }}
                      style={{ width: normalize(100) }}
                      icon="arrow-left">
                      BACK
                    </ButtonPaper>
                    <ButtonPaper
                      mode="contained"
                      onPress={handleLoginAfterGettingOtp}
                      icon="login"
                      style={{
                        paddingLeft: normalize(30),
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      LOGIN
                    </ButtonPaper>
                  </View>
                </View>
              )} */}
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
            {/* <View style={{ flexDirection: "row", position: "absolute", top: 442, alignSelf: "center" }}>
              {
                new Array(25).fill(2).map((item, i) => (
                  <InvertedTriangle key={i} />
                ))
              }
            </View> */}
          </LinearGradient>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withTheme(LoginScreen)

const styles = StyleSheet.create({
  loginWrapper: {
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    padding: normalize(20, "width"),
    width: SCREEN_WIDTH,
  },

  containerBox: {
    paddingTop: normalize(30),
    height: SCREEN_HEIGHT / 1.8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "space-between",
  },

  forgotOrResetText: {
    textTransform: "uppercase",
    textAlign: "center",
  },
})
