import { Linking, PermissionsAndroid, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, Code, CodeScanner, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/navigationRoutes'
import { Snackbar } from 'react-native-paper'

function CameraScreen() {
    const device = useCameraDevice('back')
    const { hasPermission, requestPermission } = useCameraPermission()
    const [scannedCode, setScannedCode] = useState<string>(() => "")
    const [scanned, setScanned] = useState(false)
    const navigation = useNavigation()
    const [navigatedFromCamera, setNavigatedFromCamera] = useState(false)


    const codeScanner: CodeScanner = useCodeScanner({
        codeTypes: ['code-128', 'code-39', 'code-93', 'codabar', 'ean-13', 'ean-8', 'itf', 'upc-e', 'upc-a'],
        onCodeScanned: (codes: Code[]) => {
            if (!scanned) {
                console.log(`Scanned ${codes.length} codes!`)
                for (const code of codes) {
                    console.log(code.type, code.value)
                    setScannedCode(code.value)
                    // navigation.dispatch(
                    //     CommonActions.navigate({
                    //         name: navigationRoutes.productsScreen,
                    //         params: {
                    //             barcode: code.value,
                    //             navigatedFromCamera: true
                    //         }
                    //     })
                    // )
                }
                setScanned(true)
                // navigation.dispatch(
                //     CommonActions.navigate({
                //         name: navigationRoutes.productsScreen,
                //         params: {
                //             barcode: scannedCode
                //         }
                //     })
                // )
            }
        }
    })

    useEffect(() => {
        const beforeRemoveListener = (e) => {
            console.log("Before remove event triggered"); // Check if the event is triggered
            if (!navigatedFromCamera && scannedCode) {
                console.log("Navigating to products screen"); // Log navigation action
                navigation.removeListener('beforeRemove', beforeRemoveListener); // Remove the listener
                navigation.navigate(navigationRoutes.productsScreen, { barcode: scannedCode });
            }
        };

        navigation.addListener('beforeRemove', beforeRemoveListener);

        return () => {
            navigation.removeListener('beforeRemove', beforeRemoveListener); // Cleanup the listener on unmount
        };
    }, [navigation, navigatedFromCamera, scannedCode]);


    const cameraPermissionRequest = () => {
        if (!hasPermission) {
            requestPermission().then(res => {
                if (res) {
                    console.log("REQUEST GRANTED...", res)
                } else {
                    console.log("REQUEST REJECTED...", res)
                }
            }).catch(err =>
                console.log("SOME PROBLEM DETECTED WHILE PERMISSION OF CAMERA GIVING...", err)
            )
        }
    }

    useEffect(() => {
        cameraPermissionRequest()
    }, [])

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera isActive={true} device={device} codeScanner={codeScanner} style={StyleSheet.absoluteFill} />
            {/* <Text>sdaghz</Text> */}
        </View>
    )
}

export default CameraScreen
