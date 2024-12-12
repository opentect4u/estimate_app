import { KeyboardTypeOptions } from "react-native"
import { TextInput } from "react-native-paper"

type InputPaperProps = {
  label: string
  value: string | number
  onChangeText: (msg: string | number) => void
  secureTextEntry?: boolean
  keyboardType?: KeyboardTypeOptions
  customStyle?: {}
  leftIcon?: string
  autoFocus?: boolean
  mode?: "outlined" | "flat"
  maxLength?: number
  selectTextOnFocus?: boolean
  disabled?: boolean
  clearTextOnFocus?: boolean
  // themeColors?: string
  hideUnderline?: boolean
}

const InputPaper = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  customStyle,
  leftIcon,
  autoFocus,
  mode = "flat",
  maxLength = 10,
  selectTextOnFocus,
  disabled,
  clearTextOnFocus,
  // themeColors,
  hideUnderline = false,
}: InputPaperProps) => {
  return (
    <TextInput
      selectTextOnFocus={selectTextOnFocus}
      mode={mode}
      keyboardType={keyboardType}
      label={label}
      value={value?.toString()}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={customStyle}
      left={leftIcon && <TextInput.Icon icon={leftIcon} />}
      // right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
      autoFocus={autoFocus}
      maxLength={maxLength}
      // underlineColor={themeColors}
      // underlineStyle={{ backgroundColor: themeColors }}
      // cursorColor={themeColors}
      // // selectionColor={themeColors}
      // textColor={themeColors}
      // placeholderTextColor={themeColors}
      disabled={disabled}
      clearTextOnFocus={clearTextOnFocus}
      underlineStyle={{
        display: !hideUnderline ? "flex" : "none"
      }}
    />
  )
}

export default InputPaper
