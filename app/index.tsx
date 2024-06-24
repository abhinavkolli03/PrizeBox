import { ScrollView, Image, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './components/CustomButton';
import { images } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import React from 'react';

const PrizeBoxApp = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/dashboard" />

  return (
    <SafeAreaView className="h-full bg-black-100 dark:bg-black-100">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
          <View className="w-[180px] h-[180px] rounded-full overflow-hidden bg-white justify-center items-center mt-10">
            <Image
              source={images.logo}
              className="w-full h-full"
            />
          </View>

          <View className="relative mt-10">
            <Text className="text-3xl font-bold text-center text-orange-light">PrizeBox</Text>
            <Text className="text-2xl text-white font-bold text-center pt-5">
              Where Savings Meet Convenience
            </Text>

            <Image
              source={{ uri: 'placeholder-path-url' }} //need another image
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-m font-pmedium text-white mt-20 text-center">
            Scan, save, and share your latest coupons and rewards!
          </Text>
        </View>

        <View className="w-full px-4 mt-auto mb-10">
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/signin")}
            containerStyles="w-full mt-7 bg-teal text-white"
            isLoading={false}
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  )
}

export default PrizeBoxApp;
