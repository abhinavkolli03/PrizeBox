import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BarcodeDigitizer from './BarcodeDigitizer';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ScanModalProps {
  visible: boolean;
  onClose: () => void;
  barcodeData: string;
}

const ScanModal: React.FC<ScanModalProps> = ({ visible, onClose, barcodeData }) => {
  const [vendor, setVendor] = useState('');
  const [couponType, setCouponType] = useState('cash discount');
  const [rewardDetail, setRewardDetail] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [vendorError, setVendorError] = useState('');
  const [rewardDetailError, setRewardDetailError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [expirationDateError, setExpirationDateError] = useState('');
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || expirationDate;
    setShowDatePicker(false);
    setExpirationDate(currentDate);
  };

  const validateInputs = () => {
    let valid = true;
  
    if (vendor.trim() === '') {
      setVendorError('Vendor is required.');
      valid = false;
    } else {
      setVendorError('');
    }
  
    if (rewardDetail.trim() === '') {
      setRewardDetailError('Reward detail is required.');
      valid = false;
    } else if (isNaN(Number(rewardDetail))) {
      setRewardDetailError('Invalid input type.');
      valid = false;
    } else {
      setRewardDetailError('');
    }
  
    if (description.trim() === '') {
      setDescriptionError('Description is required.');
      valid = false;
    } else {
      setDescriptionError('');
    }
  
    if (expirationDate <= new Date()) {
      setExpirationDateError('Expiration date must be in the future.');
      valid = false;
    } else {
      setExpirationDateError('');
    }
  
    return valid;
  };
  

  const getSymbolForCouponType = (type: string) => {
    switch (type) {
      case 'cash discount':
        return <Icon name="dollar" size={20} color="#095d66" />;
      case 'percentage off':
        return <Icon name="percent" size={20} color="#095d66" />;
      case 'buy one get one':
        return <Icon name="gift" size={20} color="#095d66" />;
      case 'limited time offer':
        return <Icon name="eye" size={20} color="#095d66" />;
      default:
        return <Icon name="tag" size={20} color="#095d66" />;
    }
  };

  const handleSave = () => {
    setIsSaveAttempted(true);
    if (validateInputs()) {
      clearInputs();
      onClose();
    }
  };

  const clearInputs = () => {
    setVendor('');
    setCouponType('cash discount');
    setRewardDetail('');
    setDescription('');
    setExpirationDate(new Date());
    setShowDatePicker(false);
    setVendorError('');
    setRewardDetailError('');
    setExpirationDateError('');
    setDescriptionError('');
    setIsSaveAttempted(false);
  }


  useEffect(() => {
    if (isSaveAttempted) {
      validateInputs();
    }
  }, [vendor, rewardDetail, description, expirationDate]);

  const isQRCode = barcodeData && barcodeData.startsWith('{');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center bg-primary items-center bg-opacity-80">
          <View className="bg-surface-dark p-6 rounded-2xl w-11/12 shadow-lg">
            <ScrollView>
              <Text className="text-2xl font-psemibold text-center mb-4 color-white">Scanned Reward</Text>
              <TextInput
                className="border border-teal-200 font-pregular rounded-lg p-2 mb-4 text-white"
                placeholder="Vendor"
                placeholderTextColor="#949393"
                value={vendor}
                onChangeText={setVendor}
                style={{ color: '#FFFFFF' }}
              />
              {vendorError ? <Text className="text-red-500 mb-4">{vendorError}</Text> : null}
              <View className="border border-teal-200 rounded-lg mb-4 p-2 pb-40">
                <Picker
                  selectedValue={couponType}
                  onValueChange={(itemValue) => setCouponType(itemValue)}
                  style={{ height: 40, color: "#949393" }}
                  itemStyle={{ color: '#FFFFFF' }}
                  className="font-pregular"
                >
                  <Picker.Item label="Cash Discount" value="cash discount" />
                  <Picker.Item label="Percentage Off" value="percentage off" />
                  <Picker.Item label="Buy One Get One" value="buy one get one" />
                  <Picker.Item label="Free Item" value="free item" />
                  <Picker.Item label="Limited Time Offer" value="limited time offer" />
                </Picker>
              </View>

              <View className="flex flex-row items-center border border-teal-200 rounded-lg p-2 mb-4">
                <View className="mr-2 text-white">{getSymbolForCouponType(couponType)}</View>
                <TextInput
                  className="flex-1 text-white font-pregular"
                  placeholder="Reward Detail"
                  placeholderTextColor="#949393"
                  value={rewardDetail}
                  onChangeText={setRewardDetail}
                  style={{ color: '#FFFFFF' }}
                />
              </View>
              {rewardDetailError ? <Text className="text-red-500 mb-4">{rewardDetailError}</Text> : null}
              <TextInput
                className="border border-teal-200 rounded-lg p-2 mb-4 text-white font-pregular"
                placeholder="Description"
                placeholderTextColor="#949393"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={120}
                style={{ color: '#FFFFFF' }}
              />
              {descriptionError ? <Text className="text-red-500 mb-4">{descriptionError}</Text> : null}
              <View className="flex flex-row items-center border bg-teal-700 rounded-lg p-2 mb-4 justify-between">
                <Text className='text-white font-pregular'>Expiration:</Text>
                <View className="flex-1">
                  <DateTimePicker
                    value={expirationDate}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                    textColor="#FFFFFF"
                    className="font-pregular"
                  />
                </View>
              </View>
              {expirationDateError ? <Text className="text-red-500 mb-4">{expirationDateError}</Text> : null}


              <BarcodeDigitizer data={barcodeData}/>
              <TouchableOpacity 
                className="bg-teal-700 p-4 rounded-lg mt-4"
                onPress={handleSave}
              >
                <Text className="text-white text-center text-lg font-pbold">Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ScanModal;
