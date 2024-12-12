import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import React, { PropsWithChildren } from "react"
import normalize from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"

type SquircleBoxProps = {
  backgroundColor: string
  textColor: string
  height?: number | "auto"
  width?: number
}

const SquircleBox = ({
  backgroundColor,
  textColor,
  width = 295,
  height = "auto",
  children,
}: PropsWithChildren<SquircleBoxProps>) => {
  const theme = usePaperColorScheme()
  return (
    <View
      style={{
        width: normalize(width),
        minHeight: height,
        height: "auto",
        backgroundColor: backgroundColor,
        alignSelf: "center",
        borderRadius: normalize(20),
        borderWidth: 2,
        borderColor: theme.colors.onSurface,
        borderStyle: "dashed",
        padding: normalize(20),
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text
        style={{ color: textColor, textAlign: "center", fontWeight: "700" }}
        variant="bodyLarge">
        {children}
      </Text>
    </View>
  )
}

export default SquircleBox
