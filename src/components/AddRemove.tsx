import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputChangeEventData, View } from 'react-native'
import React, { useState } from 'react'
import { IconButton, Text } from 'react-native-paper'
import { usePaperColorScheme } from '../theme/theme'
import normalize, { SCREEN_WIDTH } from 'react-native-normalize'

type AddRemoveProps = {
    remove: () => void
    add: () => void
    value: number
    isAddDisabled?: boolean
    onChange?: (e: any) => void
    isIndividualProductScreen?: boolean
}

const AddRemove = ({ add, remove, value, isAddDisabled, onChange, isIndividualProductScreen = false }: AddRemoveProps) => {
    const theme = usePaperColorScheme()

    return (
        <View style={{
            flexDirection: "row",
            position: "absolute",
            left: !isIndividualProductScreen ? 152 : 135,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
        }}>
            <IconButton style={{
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6
            }} icon="minus-thick" onPress={remove} mode="contained" iconColor={theme.colors.onErrorContainer} containerColor={theme.colors.errorContainer} size={isIndividualProductScreen ? 30 : 20} />
            <View style={{
                width: !isIndividualProductScreen ? normalize(40) : normalize(45),
                height: !isIndividualProductScreen ? "75%" : "80%",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                borderRadius: 8,
                backgroundColor: theme.colors.vanillaSecondaryContainer,
                // borderStyle: "dashed",
                // borderWidth: 1
            }}>
                <Text variant='bodyMedium' style={{ color: theme.colors.onVanillaSecondaryContainer }}>{value}</Text>
                {/* <TextInput style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    color: theme.colors.onVanillaSecondaryContainer
                }} value={value?.toString()} selectTextOnFocus onChange={onChange} keyboardType='number-pad' /> */}
            </View>
            <IconButton disabled={isAddDisabled} style={{
                borderBottomLeftRadius: 6,
                borderTopLeftRadius: 6
            }} icon="plus-thick" onPress={add} mode="contained" iconColor={theme.colors.onVanillaTertiaryContainer} containerColor={theme.colors.vanillaTertiaryContainer} size={isIndividualProductScreen ? 30 : 20} />
        </View>
    )
}

export default AddRemove

const styles = StyleSheet.create({})