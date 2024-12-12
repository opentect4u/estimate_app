import { PropsWithChildren } from "react"
import { Dialog, Portal, Button } from "react-native-paper"
import { usePaperColorScheme } from "../theme/theme"

type DialogBoxProps = {
  visible: boolean
  hide: () => void
  title?: string
  btnFail?: string
  btnSuccess?: string
  icon?: string
  iconSize?: number
  titleStyle?: {}
  buttonSuccessIcon?: string
  dismissable?: boolean
}

export default function DialogBoxForReprint({
  children,
  visible,
  icon,
  iconSize,
  title,
  titleStyle,
  hide,
  dismissable = false,
}: PropsWithChildren<DialogBoxProps>) {
  const theme = usePaperColorScheme()

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hide}
        theme={theme}
        dismissable={dismissable}>
        {icon && <Dialog.Icon icon={icon} size={iconSize} />}
        {title && <Dialog.Title style={titleStyle}>{title}</Dialog.Title>}
        <Dialog.Content>{children}</Dialog.Content>
      </Dialog>
    </Portal>
  )
}
