// components/BarcodeDigitizer.js
import React from 'react';
import { View, Text } from 'react-native';
import Barcode from 'react-native-barcode-svg';

interface BarcodeDigitizerProps {
    data: string;
}

const BarcodeDigitizer:React.FC<BarcodeDigitizerProps> = ({ data }) => {
  return (
    <View className="flex items-center justify-center border border-teal-200 mt-4 pt-4 pb-4 rounded-lg">
      <Barcode
        value={data}
        format="CODE128"
        height={100}
        lineColor="#000000"
        backgroundColor="#FFFFFF"
      />
      <Text className="mt-2 color-white">{data}</Text>
    </View>
  );
};

export default BarcodeDigitizer;
