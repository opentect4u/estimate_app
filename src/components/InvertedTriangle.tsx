import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { usePaperColorScheme } from '../theme/theme'

const InvertedTriangle = () => {
    const theme = usePaperColorScheme()
    return (
        <View style={[styles.triangle, { borderTopColor: theme.colors.onPrimary, }]}>

        </View>
    )
}

export default InvertedTriangle

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 14,
        borderRightWidth: 7,
        borderBottomWidth: 0,
        borderLeftWidth: 6.82,
        // borderTopColor: 'dodgerblue',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    }
})