import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, CameraType } from 'expo-camera';

export default function BarcodeScanner() {
  const { width, height } = useWindowDimensions();
  const boxWidth = width * 0.75;
  const boxHeight = height * 0.15;
  const boxLeft = (width - boxWidth) / 2;
  const boxTop = (height - boxHeight) / 2;
  const boxRight = boxLeft + boxWidth;
  const boxBottom = boxTop + boxHeight;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeBounds, setBarcodeBounds] = useState<any>(null);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Camera permission not granted');
      }
    })();
  }, []);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    const { bounds } = result;
    const { origin, size } = bounds;
    const barcodeLeft = origin.x;
    const barcodeTop = origin.y;
    const barcodeRight = barcodeLeft + size.width;
    const barcodeBottom = barcodeTop + size.height;

    if (
      barcodeLeft >= boxLeft &&
      barcodeRight <= boxRight &&
      barcodeTop >= boxTop &&
      barcodeBottom <= boxBottom
    ) {
      setScanned(true);
      setBarcodeBounds(result.bounds);
      setBarcodeData(result.data);
      Alert.alert(
        'Barcode Scanned',
        `Data: ${result.data}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setBarcodeBounds(null);
              setTimeout(() => {
                setScanned(false);
                setBarcodeData(null);
              }, 400);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prevFacing: string) => (prevFacing === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    // camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center">We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={cameraFacing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128'],
        }}
      />
      <View className="absolute inset-0 flex justify-center items-center">
        <View style={{ position: 'absolute',
            left: (width - boxWidth) / 2,
            top: (height - boxHeight) / 2}}>
          <View className="relative" style={{ width: boxWidth, height: boxHeight }}>
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gray-500 rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gray-500 rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gray-500 rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gray-500 rounded-br-lg" />
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="absolute bottom-10 self-center bg-black bg-opacity-50 p-3 rounded-full"
        onPress={toggleCameraFacing}
      >
        <Text className="text-white text-lg">Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}
