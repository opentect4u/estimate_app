import { Alert, Linking, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, Code, CodeScanner, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { CommonActions, useNavigation } from '@react-navigation/native'
import Sound from 'react-native-sound'
import { productHeader, productHeaderDark } from "../resources/images"
import navigationRoutes from '../routes/navigationRoutes'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import { usePaperColorScheme } from '../theme/theme'
import HeaderImage from '../components/HeaderImage'
import { getUniqueWithMaxCount } from '../utils/getUniqueWithMaxCount'

const SAMPLING_RATE = 16

function CameraScreen() {
    const device = useCameraDevice('back')
    const { hasPermission, requestPermission } = useCameraPermission()
    const [scannedCode, setScannedCode] = useState<string>(() => "")
    const [scanned, setScanned] = useState(false)
    const navigation = useNavigation()
    const theme = usePaperColorScheme()

    let samplingBarcodes: Code[][] = [[]]
    let barcodes: string[] = []

    Sound.setCategory("Alarm")

    var beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error)
            return
        }
    })

    beep.setVolume(1)

    const codeScanner: CodeScanner = useCodeScanner({
        codeTypes: ['code-128', 'code-39', 'code-93', 'codabar', 'ean-13', 'ean-8', 'itf', 'upc-e', 'upc-a'],
        onCodeScanned: (codes: Code[]) => {
            if (!scanned) {
                console.log(`Scanned ${codes.length} codes!`)
                samplingBarcodes.push(codes)

                if (samplingBarcodes.length >= SAMPLING_RATE) {
                    setScanned(true)

                    for (const codes of samplingBarcodes) {
                        for (const code of codes) {
                            console.log(code.type, code.value)

                            barcodes.push(code.value)

                            console.log("CODEEEE====", code)
                            console.log("CODEEEESSSS====", codes)
                        }
                    }

                    const uniqueWithMaxCount = getUniqueWithMaxCount(barcodes)
                    console.log("UNIQUE CODE +++++++======", uniqueWithMaxCount)

                    navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.categoryProductsScreen,
                            params: {
                                barcode: uniqueWithMaxCount,
                                navigatedFromCamera: true
                            }
                        })
                    )
                    setScannedCode(uniqueWithMaxCount)

                    beep.play(success => {
                        if (success) {
                            console.log("BEEP PLAYED.")
                        } else {
                            console.log("BEEP ERROR!")
                        }
                    })
                }

            }
        }
    })

    useEffect(() => {
        const cameraPermissionRequest = () => {
            if (!hasPermission) {
                requestPermission().then(res => {
                    if (res) {
                        console.log("REQUEST GRANTED...", res)
                    } else {
                        console.log("REQUEST REJECTED...", res)
                        Alert.alert(
                            "Allow Permissions",
                            "Click Open Settings: Go to Permissions -> Allow Camera access.",
                            [
                                { text: "Open Settings", onPress: () => Linking.openSettings() },
                                { text: "Later", onPress: () => null },
                            ],
                        )
                    }
                }).catch(err =>
                    console.log("SOME PROBLEM DETECTED WHILE PERMISSION OF CAMERA GIVING...", err)
                )
            }
        }
        if (Platform.OS === "android") {
            cameraPermissionRequest()
        }
    }, [])

    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={{ alignItems: "center" }}>
                <HeaderImage
                    imgLight={productHeader}
                    imgDark={productHeaderDark}
                    borderRadius={30}
                    blur={10}
                    isBackEnabled>
                    Scan Barcode
                </HeaderImage>
            </View>
            <View style={{
                width: SCREEN_WIDTH / 1.14,
                height: SCREEN_HEIGHT / 3.4,
                borderWidth: 15,
                borderColor: theme.colors.primary,
                borderRadius: 20,
                alignSelf: "center"
            }}>
                <Camera isActive={true} device={device} codeScanner={codeScanner} style={[StyleSheet.absoluteFill]} focusable enableZoomGesture collapsable />
            </View>
        </View>
    )
}

export default CameraScreen
