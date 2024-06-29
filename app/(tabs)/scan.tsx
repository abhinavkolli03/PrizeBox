import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, TouchableOpacity, Text, useWindowDimensions, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, CameraType } from 'expo-camera';
import { FontAwesome } from 'react-native-vector-icons';
import ScanModal from '../components/ScanModal';

export default function BarcodeScanner() {
  const { width, height } = useWindowDimensions();
  const [boxDimensions, setBoxDimensions] = useState({ boxWidth: width * 0.75, boxHeight: height * 0.15 });
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeBounds, setBarcodeBounds] = useState<any>(null);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [modalVisible, setModalVisible] = useState(false);
  const [scanMode, setScanMode] = useState('barcode');
  const [cameraMode, setCameraMode] = useState('manual');
  const [flash, setFlash] = useState('off');
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Camera permission not granted');
      }
    })();

    if (scanMode === 'qr') {
      setBoxDimensions({ boxWidth: width * 0.6, boxHeight: width * 0.6 });
    } else {
      setBoxDimensions({ boxWidth: width * 0.75, boxHeight: height * 0.15 });
    }
  }, [scanMode, requestPermission]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    const { bounds } = result;
    const { origin, size } = bounds;
    const barcodeLeft = origin.x;
    const barcodeTop = origin.y;
    const barcodeRight = barcodeLeft + size.width;
    const barcodeBottom = barcodeTop + size.height;

    const { boxWidth, boxHeight } = boxDimensions;
    const boxLeft = (width - boxWidth) / 2;
    const boxTop = (height - boxHeight) / 2;
    const boxRight = boxLeft + boxWidth;
    const boxBottom = boxTop + boxHeight;

    if (
      barcodeLeft >= boxLeft &&
      barcodeRight <= boxRight &&
      barcodeTop >= boxTop &&
      barcodeBottom <= boxBottom
    ) {
      setScanned(true);
      setBarcodeBounds(result.bounds);
      setBarcodeData(result.data);
      setModalVisible(true);
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prevFacing: string) => (prevFacing === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((prevFlash) => (prevFlash === 'off' ? 'torch' : 'off'));
  };

  const toggleScanMode = () => {
    setScanMode((prevMode) => (prevMode === 'barcode' ? 'qr' : 'barcode'));
  };

  const completeSave = () => {
    setBarcodeBounds(null);
    setModalVisible(false);
    setScanned(false);
    setBarcodeData(null);
    setTimeout(() => {
      setScanned(false);
      setBarcodeData(null);
    }, 1000);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center">We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { boxWidth, boxHeight } = boxDimensions;
  const boxLeft = (width - boxWidth) / 2;
  const boxTop = (height - boxHeight) / 2;

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={cameraFacing}
        flash={flash}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: scanMode === 'barcode' ? ['ean13', 'ean8', 'code128'] : ['qr'],
        }}
      />
      <View className="absolute inset-0 flex justify-center items-center">
        <View style={{ position: 'absolute', left: boxLeft, top: boxTop }}>
          <View className="relative" style={{ width: boxWidth, height: boxHeight }}>
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gray-500 rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gray-500 rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gray-500 rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gray-500 rounded-br-lg" />
          </View>
        </View>
      </View>
      <View style={{ position: 'absolute', top: height / 10 - 30, width: width * 0.8, left: width * 0.1, flexDirection: 'row', backgroundColor: '#4B5563', borderRadius: 9999 }}>
        <TouchableOpacity
          onPress={() => setCameraMode('manual')}
          style={{ flex: 1, padding: 8, borderTopLeftRadius: 9999, borderBottomLeftRadius: 9999, backgroundColor: cameraMode === 'manual' ? '#02807d' : '#6B7280', opacity: cameraMode === 'manual' ? 1 : 0.6, alignItems: 'center' }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }} className="font-psemibold">Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCameraMode('automatic')}
          style={{ flex: 1, padding: 8, borderTopRightRadius: 9999, borderBottomRightRadius: 9999, backgroundColor: cameraMode === 'automatic' ? '#02807d' : '#6B7280', opacity: cameraMode === 'automatic' ? 1 : 0.6, alignItems: 'center' }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }} className="font-psemibold">Automatic</Text>
        </TouchableOpacity>
      </View>


      <View className="absolute top-36 right-4 flex-col space-y-4">
        <TouchableOpacity onPress={toggleFlash} className="p-2 opacity-80 rounded-full" style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesome name="flash" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleScanMode} className="p-2 opacity-80 rounded-full" style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesome name={scanMode === 'barcode' ? 'barcode' : 'qrcode'} size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraFacing} className="p-2 opacity-80 rounded-full" style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesome name="refresh" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScanModal visible={modalVisible}
        onClose={completeSave}
        barcodeData={barcodeData as string}
      />
    </View>
  );
}
