import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BarcodeDigitizer from './BarcodeDigitizer';
import Icon from 'react-native-vector-icons/FontAwesome';

const ScanModal = ({ visible, onClose, barcodeData }) => {
  const [vendor, setVendor] = useState('');
  const [couponType, setCouponType] = useState('cash discount');
  const [rewardDetail, setRewardDetail] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expirationDate;
    setShowDatePicker(false);
    setExpirationDate(currentDate);
  };

  const getSymbolForCouponType = (type) => {
    switch (type) {
      case 'cash discount':
        return <Icon name="dollar" size={20} color="#000" />;
      case 'percentage off':
        return <Icon name="percent" size={20} color="#000" />;
      case 'buy one get one':
        return <Icon name="gift" size={20} color="#000" />;
      default:
        return <Icon name="tag" size={20} color="#000" />;
    }
  };

  const isQRCode = barcodeData && barcodeData.startsWith('{');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-orange-100">
          <View className="bg-white p-6 rounded-lg w-11/12 shadow-lg">
            <ScrollView>
              <Text className="text-2xl font-bold text-center mb-4">Edit Card</Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                placeholder="Vendor"
                value={vendor}
                onChangeText={setVendor}
              />
              <View className="border border-gray-300 rounded mb-4 p-2 pb-40">
                <Picker
                  selectedValue={couponType}
                  onValueChange={(itemValue) => setCouponType(itemValue)}
                  style={{ height: 40 }}
                >
                  <Picker.Item label="Cash Discount" value="cash discount" />
                  <Picker.Item label="Percentage Off" value="percentage off" />
                  <Picker.Item label="Buy One Get One" value="buy one get one" />
                  <Picker.Item label="Free Item" value="free item" />
                  <Picker.Item label="Limited Time Offer" value="limited time offer" />
                </Picker>
              </View>
              <View className="flex flex-row items-center border border-gray-300 rounded p-2 mb-4">
                <View className="mr-2">{getSymbolForCouponType(couponType)}</View>
                <TextInput
                  className="flex-1"
                  placeholder="Reward Detail"
                  value={rewardDetail}
                  onChangeText={setRewardDetail}
                />
              </View>
              <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={120} // Approximate limit for 3 lines
              />
              <View className="flex flex-row items-center border border-gray-300 rounded p-2 mb-4 justify-between">
                <Text>Expiration:</Text>
                <DateTimePicker
                    value={expirationDate}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                    style={{ flex: 1 }}
                />
              </View>
              <BarcodeDigitizer data={barcodeData} isQRCode={isQRCode} />
              <TouchableOpacity
                className="bg-orange-500 p-4 rounded mt-4"
                onPress={onClose}
              >
                <Text className="text-white text-center text-lg">Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ScanModal;
