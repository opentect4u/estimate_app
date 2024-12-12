import { StyleSheet, View } from 'react-native'
import React from 'react'
import normalize, { SCREEN_WIDTH } from 'react-native-normalize'
import { usePaperColorScheme } from '../theme/theme'
import ButtonPaper from './ButtonPaper'
import { Badge, IconButton, Text } from 'react-native-paper'

type SnackBarProps = {
    totAmt: string
    cartItemQty?: number
    handleBtn1Press: () => void
    handleBtn2Press: () => void
    handleBtn3Press?: () => void
    disableNext?: boolean
    hideCart?: boolean
    disableCart?: boolean
}

const SnackBar = ({ handleBtn1Press, handleBtn2Press, handleBtn3Press, totAmt, cartItemQty, disableNext, hideCart = false, disableCart }: SnackBarProps) => {
    const theme = usePaperColorScheme()
    return (
        <View style={{
            flexDirection: "row",
            // paddingHorizontal: normalize(20),
            alignSelf: "center",
            width: SCREEN_WIDTH / 1,
            height: normalize(80),
            // backgroundColor: theme.colors.vanilla,
            // backgroundColor: "blue",
            padding: 15,
            // backgroundColor: theme.colors.secondaryContainer,
            // borderRadius: normalize(20),
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 2,
        }}>
            {
                !hideCart && <View style={{
                    // marginLeft: "-5%"
                    backgroundColor: theme.colors.vanillaTertiary,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: 30,
                    borderBottomLeftRadius: 30,
                }}>
                    <IconButton iconColor={theme.colors.onVanilla} icon="cart-variant" onPress={handleBtn3Press} disabled={disableCart} />
                    <Badge visible={cartItemQty !== 0} style={{
                        position: "absolute",
                        top: 1,
                        right: 1,
                        backgroundColor: theme.colors.vanillaContainer,
                        color: theme.colors.onVanillaContainer,
                        fontWeight: "bold"
                    }}>{cartItemQty}</Badge>
                </View>
            }
            <View style={{
                backgroundColor: theme.colors.error,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <IconButton iconColor={theme.colors.onVanilla} icon="trash-can-outline" onPress={handleBtn2Press} />
            </View>
            <View style={{
                backgroundColor: theme.colors.vanillaSecondary,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 100,
                gap: -5
            }}>
                <Text variant="bodyMedium" ellipsizeMode='tail' numberOfLines={2} style={{ color: theme.colors.onVanilla, textAlign: "center", paddingHorizontal: 15, flexWrap: "wrap" }}>Net Total</Text>
                <Text style={{ color: theme.colors.onVanilla, textAlign: "center", paddingHorizontal: 15, flexWrap: "wrap" }}>•</Text>
                <Text style={{ color: theme.colors.onVanilla, textAlign: "center", paddingHorizontal: 15, flexWrap: "wrap" }}>₹{totAmt}</Text>
            </View>

            <View style={{
                backgroundColor: theme.colors.vanilla,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderTopRightRadius: 30,
                borderBottomRightRadius: 30
            }}>
                <ButtonPaper icon="arrow-right-thick" textColor={theme.colors.onVanilla} onPress={handleBtn1Press} mode="text" disabled={disableNext}>NEXT</ButtonPaper>
            </View>
        </View>

    )
}

export default SnackBar

const styles = StyleSheet.create({})