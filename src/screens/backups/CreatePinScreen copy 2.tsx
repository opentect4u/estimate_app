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
import InputPaper from "../components/InputPaper"
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
import { productHeader, productHeaderDark } from "../resources/images"
import SurfacePaper from "../components/SurfacePaper"

const CreatePinScreen = () => {
  const navigation = useNavigation()
  const { params } = useRoute()
  const { mobile_no } = params as { mobile_no: string }

  const theme = usePaperColorScheme()

  const { createPin } = useCreatePin()

  const [pin, setPin] = useState<string>(() => "")
  const [confirmPin, setConfirmPin] = useState<string>(() => "")

  const handleCreatePin = async () => {
    if (pin !== confirmPin) {
      Alert.alert("Error", "PIN is not matching! Re-Enter PIN.")

      clearStates([setPin, setConfirmPin], () => "")
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

          <View style={{ justifyContent: "center" }}>
            <View
              style={{
                marginVertical: SCREEN_HEIGHT / 25,
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
                  New Pin
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

                  // borderBottomWidth: 2,
                  // borderLeftWidth: 2,
                  // borderRightWidth: 2,
                  // borderBottomLeftRadius: normalize(10),
                  // borderBottomRightRadius: normalize(10),
                  // borderColor: theme.colors.onPrimary,
                }}
                // cellStyle={{
                //     borderWidth: 1,
                //     borderRadius: 5,
                //     borderColor: theme.colors.onPrimary,
                // }}
                cellStyleFocused={null}
                value={pin}
                onTextChange={(pin: string) => setPin(pin)}
              />

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

                  // borderTopWidth: 2,
                  // borderLeftWidth: 2,
                  // borderRightWidth: 2,
                  // borderTopLeftRadius: normalize(10),
                  // borderTopRightRadius: normalize(10),
                }}
                // cellStyle={{
                //     borderWidth: 1,
                //     borderRadius: 5,
                //     borderColor: theme.colors.onPrimary,
                // }}
                cellStyleFocused={null}
                value={confirmPin}
                onTextChange={(confirmPin: string) => setConfirmPin(confirmPin)}
              />
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  height: SCREEN_HEIGHT / 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <Text variant="labelLarge" style={{ textAlign: "center" }}>
                  Confirm Pin
                </Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: normalize(30) }}>
              <ButtonPaper
                mode="contained"
                buttonColor={theme.colors.secondaryContainer}
                textColor={theme.colors.onSecondaryContainer}
                onPress={handleCreatePin}
                icon="arrow-right">
                JOIN
              </ButtonPaper>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreatePinScreen

const styles = StyleSheet.create({})
