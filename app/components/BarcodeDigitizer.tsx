// components/BarcodeDigitizer.js
import React from 'react';
import { View, Text } from 'react-native';
import Barcode from 'react-native-barcode-svg';

const BarcodeDigitizer = ({ data }) => {
  return (
    <View className="flex items-center justify-center mt-4">
      <Barcode
        value={data}
        format="CODE128"
        height={100}
        lineColor="#000000"
        backgroundColor="#FFFFFF"
      />
      <Text className="mt-2">{data}</Text>
    </View>
  );
};

export default BarcodeDigitizer;
