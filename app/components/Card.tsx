import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import BarcodeDigitizer from './BarcodeDigitizer';
import Icon from 'react-native-vector-icons/FontAwesome';
import DisplayCard from './DisplayCard';

interface CardProps {
  vendor: string;
  rewardDetail: string;
  description: string;
  expirationDate: Date;
  barcodeData: string;
  couponType: string;
}

const Card: React.FC<CardProps> = ({ vendor, rewardDetail, description, expirationDate, barcodeData, couponType }) => {
  const { user } = useGlobalContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const { width } = useWindowDimensions();
  const cardWidth = width - 32;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatCouponType = (type: string) => {
    return type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getSymbolForCouponType = (type: string) => {
    switch (type) {
      case 'cash discount':
        return <Icon name="dollar" size={20} className="text-teal-900" />;
      case 'percentage off':
        return <Icon name="percent" size={20} className="text-teal-900" />;
      case 'buy one get one':
        return <Icon name="gift" size={20} className="text-teal-900" />;
      case 'limited time offer':
        return <Icon name="eye" size={20} className="text-teal-900"/>;
      default:
        return <Icon name="tag" size={20} className="text-teal-900" />;
    }
  };

  const formatRewardDetail = (detail: string, type: string) => {
    const numberDetail = parseFloat(detail).toFixed(2);
    if (type === 'cash discount') {
      return `$${numberDetail}`;
    } else {
      return `${numberDetail}${type === 'percentage off' ? '%' : ''}`;
    }
  };

  return (
    <TouchableOpacity onPress={toggleExpand} style={{ width: cardWidth, alignSelf: 'center' }}>
      {isExpanded ? (
        <View className="bg-teal rounded-xl p-4 mb-4 shadow-lg">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-pbold text-white">{vendor}</Text>
            <Image
              source={{ uri: user?.avatarUrl }}
              className="w-12 h-12 rounded-full border-2 border-white"
              resizeMode="cover"
            />
          </View>
          <Text className="text-xl font-pbold text-teal-900">
            {formatRewardDetail(rewardDetail, couponType)}
          </Text>
          <Text className="text-lg font-pregular text-white">Reward Type: {formatCouponType(couponType)}</Text>
          <Text className="text-sm font-pregular text-gray-300 mb-4">{description}</Text>
          <Text className="text-sm font-psemibold text-gray-900 mb-4 text-center">
            Expiration: {expirationDate.toLocaleDateString()} {expirationDate.toLocaleTimeString()}
          </Text>
          <View className="flex-row items-center justify-center">
            <BarcodeDigitizer data={barcodeData} />
          </View>
        </View>
      ) : (
        <DisplayCard 
          vendor={vendor}
          rewardDetail={rewardDetail}
          expirationDate={expirationDate}
          couponType={couponType}
          cardWidth={cardWidth}
        />
      )}
    </TouchableOpacity>
  );
};

export default Card;
