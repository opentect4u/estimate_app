import { PropsWithChildren } from "react"
import { ScrollView } from "react-native"
import normalize from "react-native-normalize"

type ScrollableListContainerProps = {
  backgroundColor: string
  height?: number
  width?: number
}

export default function ScrollableListContainer({
  children,
  backgroundColor,
  height = 220,
  width = 325,
}: PropsWithChildren<ScrollableListContainerProps>) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{
        width: normalize(width),
        height: normalize(height),
        backgroundColor: backgroundColor,
        alignSelf: "center",
        borderRadius: normalize(30),
      }}
      nestedScrollEnabled={true}>
      {children}
    </ScrollView>
  )
}
