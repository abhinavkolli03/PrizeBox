import { useGlobalContext } from '@/context/GlobalProvider';
import React from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface DisplayCardProps {
  vendor: string;
  rewardDetail: string;
  expirationDate: Date;
  couponType: string;
  cardWidth: number;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ vendor, rewardDetail, expirationDate, couponType, cardWidth }) => {
  const { user } = useGlobalContext();

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
    <View style={{ width: cardWidth }} className="bg-teal-700 rounded-lg p-3 mb-4 shadow-lg">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-white">{vendor}</Text>
        <Image
          source={{ uri: user?.avatarUrl }}
          className="w-10 h-10 rounded-full border-2 border-white"
          resizeMode="cover"
        />
      </View>
      <Text className="text-lg font-bold text-white">
        {formatRewardDetail(rewardDetail, couponType)}
      </Text>
      <Text className="text-base font-regular text-white">{formatCouponType(couponType)}</Text>
      <Text className="text-xs font-semibold text-black mb-2 mt-2 text-center">
        Expiration: {expirationDate.toLocaleDateString()}
      </Text>
    </View>
  );
};

export default DisplayCard;
