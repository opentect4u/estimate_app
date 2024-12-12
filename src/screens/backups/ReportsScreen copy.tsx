import { StyleSheet, ScrollView, SafeAreaView, View } from "react-native"

import { REPORT_SCREEN_DATA } from "../data/ui/REPORTS_SCREEN"
// import REPORTS_DATA from "../data/ui/REPORTS_SCREEN.json"
import HeaderImage from "../components/HeaderImage"
import { blurReport, blurReportDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import ReportButton from "../components/ReportButton"
import ReportButtonsWrapper from "../components/ReportButtonsWrapper"
import { CommonActions, useNavigation } from "@react-navigation/native"
import navigationRoutes from "../routes/navigationRoutes"
import { useContext } from "react"
import { AppStore } from "../context/AppContext"
import { SCREEN_WIDTH } from "react-native-normalize"
import { AppStoreContext } from "../models/custom_types"

function ReportsScreen() {
  const navigation = useNavigation()
  const theme = usePaperColorScheme()

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={blurReport}
            imgDark={blurReportDark}
            borderRadius={30}
            blur={10}>
            My Reports
          </HeaderImage>
        </View>
        <ReportButtonsWrapper>
          
          {
            REPORT_SCREEN_DATA.map((item, index) => {
              return (
                <ReportButton
                  text={item?.text}
                  color={index % 2 === 0 ? theme.colors.purpleContainer : theme.colors.primaryContainer}
                  textColor={index % 2 === 0 ? theme.colors.onPurpleContainer : theme.colors.onPrimaryContainer}
                  icon={item?.icon}
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: item?.route
                      }),
                    )
                  }
                />
              )
            })
          }


          {/* <ReportButton
            text="Sale Report"
            color={theme.colors.purpleContainer}
            textColor={theme.colors.onPurpleContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.saleReportScreen,
                }),
              )
            }
          />
          <ReportButton
            text="Collection Report"
            color={theme.colors.primaryContainer}
            textColor={theme.colors.onPrimaryContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.collectionReportScreen,
                }),
              )
            }
          />
          <ReportButton
            text="Item Report"
            color={theme.colors.purpleContainer}
            textColor={theme.colors.onPurpleContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.itemReportScreen,
                }),
              )
            }
          />
          <ReportButton
            text="Stock Report"
            color={theme.colors.purpleContainer}
            textColor={theme.colors.onPurpleContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.stockReportScreen,
                }),
              )
            }
          />
          <ReportButton
            text="Refund Report"
            color={theme.colors.primaryContainer}
            textColor={theme.colors.onPrimaryContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.refundReportScreen,
                }),
              )
            }
          />

          {receiptSettings?.gst_flag === "Y" && (
            <ReportButton
              text="GST Statement"
              color={theme.colors.purpleContainer}
              textColor={theme.colors.onPurpleContainer}
              icon="billboard"
              onPress={() =>
                navigation.dispatch(
                  CommonActions.navigate({
                    name: navigationRoutes.gstStatementReportScreen,
                  }),
                )
              }
            />
          )}

          {receiptSettings?.gst_flag === "Y" && (
            <ReportButton
              text="GST Summary"
              color={theme.colors.primaryContainer}
              textColor={theme.colors.onPrimaryContainer}
              icon="billboard"
              onPress={() =>
                navigation.dispatch(
                  CommonActions.navigate({
                    name: navigationRoutes.gstSummaryReportScreen,
                  }),
                )
              }
            />
          )}

          <ReportButton
            text="Credit Report"
            color={theme.colors.primaryContainer}
            textColor={theme.colors.onPrimaryContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.creditReportScreen,
                }),
              )
            }
          /> */}








          {/* <ReportButton
            text="Cancelled Bills Report"
            color={theme.colors.secondaryContainer}
            icon="billboard"
            onPress={() => navigation.dispatch(
              CommonActions.navigate({
                name: navigationRoutes.cancelledBillsReportScreen,
              })
            )}
          /> */}
          {/* <ReportButton
            text="Refund Items Report"
            color={theme.colors.orangeContainer}
            icon="billboard"
            onPress={() => navigation.dispatch(
              CommonActions.navigate({
                name: navigationRoutes.refundItemsReportScreen,
              })
            )}
          /> */}
        </ReportButtonsWrapper>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReportsScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
