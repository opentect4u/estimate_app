import {
  View,
  ScrollView,
  StyleSheet,
} from "react-native"
import React, { useContext, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, TouchableRipple } from "react-native-paper"
import normalize from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import DialogBox from "../components/DialogBox"
import { loginStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import { useIsFocused } from "@react-navigation/native"
import ButtonPaper from "../components/ButtonPaper"
import ProfileSection from "../components/ProfileSection"
import { AppStoreContext } from "../models/custom_types"
import { LoginDataMessage } from "../models/api_types"

export default function ProfileScreen() {
  const isFocused = useIsFocused()
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data")) as LoginDataMessage

  const { handleLogout } = useContext<AppStoreContext>(AppStore)

  const [visible, setVisible] = useState(() => false)

  const [storeOrUser, setStoreOrUser] = useState(() => true)
  const [btnIdentifier, setBtnIdentifier] = useState<"S" | "U">(() => "S")

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  const loggingOut = () => {
    handleLogout()
    hideDialog()
  }

  const handleStoreOrUserShow = (id: number) => {
    if (id === 1) {
      setStoreOrUser(true)
      setBtnIdentifier("S")
    } else {
      setStoreOrUser(false)
      setBtnIdentifier("U")
    }
  }

  const tabsStore = [
    { left: "Address:", right: loginStore?.address },
    { left: "Location:", right: loginStore?.branch_address },
    { left: "Outlet Name:", right: loginStore?.branch_name },
    // { left: "Proprietor Name:", right: loginStore?.contact_person },
    // { left: "Email:", right: loginStore?.email_id },
    // { left: "Mobile Number:", right: loginStore?.phone_no },
  ]

  const tabsUser = [
    // { left: "User Name:", right: loginStore?.user_name },
    {
      left: "User Type:",
      right:
        loginStore?.user_type === "M"
          ? "Manager"
          : loginStore?.user_type === "U"
            ? "User"
            : "Admin",
    },
    { left: "User ID:", right: loginStore?.user_id },
    { left: "Mode:", right: loginStore?.mode === "C" ? "Calculator Mode" : "Normal Mode" },
  ]

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={flowerHome}
            imgDark={flowerHomeDark}
            borderRadius={30}
            blur={10}>
            My Profile
          </HeaderImage>
        </View>

        <DialogBox
          visible={visible}
          hide={hideDialog}
          onFailure={hideDialog}
          onSuccess={loggingOut}
          title="Logging Out"
          btnSuccess="YES">
          <Text variant="bodyMedium">Are you sure you want to log out?</Text>
        </DialogBox>

        {/* <View style={{ padding: 20 }}>
                    <ButtonPaper icon="logout" mode="text" onPress={showDialog}>
                        LOG OUT
                    </ButtonPaper>
                </View> */}
        <View
          style={{
            gap: 15,
          }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}>
            <TouchableRipple
              style={{
                width: "88%",
                height: normalize(80),
                backgroundColor: theme.colors.vanillaSecondaryContainer,
                paddingHorizontal: normalize(20),
                justifyContent: "center",
                borderRadius: normalize(10),
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <ButtonPaper
                  textColor={theme.colors.onVanillaSecondaryContainer}
                  icon={"storefront-outline"}
                  onPress={() => handleStoreOrUserShow(1)}
                  mode="text"
                  buttonColor={btnIdentifier === "S" && "#191d0825"}>
                  Store Profile
                </ButtonPaper>
                <ButtonPaper
                  textColor={theme.colors.onVanillaSecondaryContainer}
                  icon={"account-circle-outline"}
                  onPress={() => handleStoreOrUserShow(2)}
                  mode="text"
                  buttonColor={btnIdentifier === "U" && "#191d0825"}>
                  User Profile
                </ButtonPaper>
              </View>
            </TouchableRipple>
          </View>

          <View
            style={{
              alignSelf: "center",
              width: "88%",
            }}>
            {storeOrUser ? (
              <ProfileSection bgColor={theme.colors.vanillaTertiaryContainer}>
                <Text
                  variant="displaySmall"
                  style={{
                    textAlign: "center",
                    padding: normalize(5),
                    color: theme.colors.onVanillaTertiaryContainer,
                  }}>
                  {loginStore?.company_name}
                </Text>

                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    borderColor: theme.colors.onVanillaTertiaryContainer,
                    borderStyle: "dashed",
                    alignSelf: "center"
                  }}></View>

                <>
                  {tabsStore?.map((i, k) => (
                    <View key={k} style={styles.tabular}>
                      <Text variant="bodyMedium">{i.left}</Text>
                      <Text
                        variant="bodyMedium"
                        style={{ flex: 0.6, textAlign: "right" }}>
                        {i.right}
                      </Text>
                    </View>
                  ))}
                </>

                {/* <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: normalize(5) }}>
                                            <ButtonPaper
                                                textColor={theme.colors.teal} icon="circle-edit-outline" mode="text" onPress={() => console.log("EDITT PRF.")}>Edit</ButtonPaper>
                                        </View> */}
              </ProfileSection>
            ) : (
              <ProfileSection bgColor={theme.colors.purpleContainer}>
                <View>
                  <Text
                    variant="displaySmall"
                    style={{
                      textAlign: "center",
                      padding: normalize(5),
                      color: theme.colors.onPurpleContainer,
                    }}>
                    {loginStore?.user_name}
                  </Text>

                  <View
                    style={{
                      borderWidth: 1,
                      width: "90%",
                      borderColor: theme.colors.onPurpleContainer,
                      borderStyle: "dashed",
                      alignSelf: "center"
                    }}></View>
                </View>

                <View
                  style={{
                    justifyContent: "space-between",
                  }}>
                  <View>
                    {tabsUser?.map((i, k) => (
                      <View key={k} style={styles.tabular}>
                        <Text variant="bodyMedium">{i.left}</Text>
                        <Text
                          variant="bodyMedium"
                          style={{ flex: 0.6, textAlign: "right" }}>
                          {i.right}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* <View style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: normalize(5) }}>
                                                <ButtonPaper
                                                    textColor={theme.colors.teal} icon="circle-edit-outline" mode="text" onPress={() => console.log("EDITT PRF.")}>Edit</ButtonPaper>
                                            </View> */}
                </View>
              </ProfileSection>
            )}
          </View>

          <View
            style={{
              alignSelf: "center",
              width: "85%",
              paddingBottom: normalize(10),
            }}>
            <ButtonPaper
              icon="logout"
              mode="contained"
              buttonColor={theme.colors.errorContainer}
              onPress={showDialog}
              textColor={theme.colors.onErrorContainer}>
              LOG OUT
            </ButtonPaper>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  tabular: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: normalize(10),
  },
})
