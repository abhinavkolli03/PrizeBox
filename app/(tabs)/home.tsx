import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, useWindowDimensions, Image, Animated } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getAllUserCards } from '@/lib/appwrite';
import DisplayCard from '../components/DisplayCard';
import SearchInput from '../components/SearchInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from '../components/Card';

const NoResults = ({ query }) => (
  <View className="flex-1 justify-center items-center mt-20">
    <Image
      source={images.empty}
      className="w-40 h-40 mb-4"
      resizeMode="contain"
    />
    <Text className="text-lg font-pregular text-white">No rewards found for query "{query}"</Text>
  </View>
);

const Home = () => {
  const { user } = useGlobalContext();
  const { width } = useWindowDimensions();
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    try {
      const userCards = await getAllUserCards(user?.id as string);
      setCards(userCards);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCards();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const onCardPress = (card) => {
    setSelectedCard(card);
    Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
    }).start();
  };

  const handleBack = () => {
      Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
      }).start(() => {
          setSelectedCard(null);
      });
  };

  const animatedContainerStyle = {
    opacity: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
    }),
    transform: [
        {
            scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.9],
            }),
        },
    ],
  };

  const filteredCards = cards.filter(card => 
    card.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardWidth = width - 32;

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <Text className="text-2xl font-psemibold text-white mb-4">Welcome back, {user?.fullName}</Text>
        <SearchInput initialQuery={searchQuery} onSearch={handleSearch} />
        {filteredCards.length > 0 ? (
          <FlatList
            data={filteredCards}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onCardPress(item)}>
                <DisplayCard
                  vendor={item.vendor}
                  rewardDetail={item.reward_amount}
                  expirationDate={new Date(item.expiration)}
                  couponType={item.reward_type}
                  cardWidth={cardWidth}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20, marginTop: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
            }
          />
        ) : (
          <NoResults query={searchQuery} />
        )}
      </Animated.View>
  
      {selectedCard && (
        <Animated.View style={[styles.expandedCard, { opacity: animation }]} className="bg-primary opacity-80">
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Card
            vendor={selectedCard.vendor}
            rewardDetail={selectedCard.reward_amount}
            description={selectedCard.description}
            expirationDate={new Date(selectedCard.expiration)}
            barcodeData={selectedCard.scanned_code}
            couponType={selectedCard.reward_type}
            cardWidth={cardWidth}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );  
};

export default Home;

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  expandedCard: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
  },
  backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 10,
      padding: 10,
  },
});
