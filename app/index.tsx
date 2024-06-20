import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Button } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, CameraType } from 'expo-camera';

export default function BarcodeScanner() {
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
    setScanned(true);
    setBarcodeBounds(result.bounds);
    setBarcodeData(result.data);
  };

  const handleProcessBarcode = () => {
    if (barcodeData) {
      alert(`Bar code data: ${barcodeData}`);
      setScanned(false);
      setBarcodeBounds(null);
      setBarcodeData(null);
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prevFacing) => (prevFacing === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">Welcome to the Barcode Scanner App!</Text>
      <Text className="text-lg mb-10">Scan a barcode to start your job.</Text>
      <View className="w-4/5 aspect-square overflow-hidden rounded-lg mb-10">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraFacing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128'],
          }}
        />
        {barcodeBounds && (
          <View
            style={{
              position: 'absolute',
              borderColor: 'red',
              borderWidth: 2,
              left: barcodeBounds.origin.x,
              top: barcodeBounds.origin.y,
              width: barcodeBounds.size.width,
              height: barcodeBounds.size.height,
            }}
          />
        )}
      </View>
      <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded mb-4" onPress={toggleCameraFacing}>
        <Text className="text-white text-lg font-bold">Flip Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`bg-blue-500 px-4 py-2 rounded ${scanned ? 'opacity-50' : ''}`}
        onPress={handleProcessBarcode}
        disabled={!barcodeData}
      >
        <Text className="text-white text-lg font-bold">Scan QR to Start your job</Text>
      </TouchableOpacity>
    </View>
  );
}
