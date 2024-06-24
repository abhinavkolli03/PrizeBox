import React, { useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, icons } from '../../constants';
import { signOut } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [isLoading, setIsLoading] = React.useState(true);

  console.log(user)

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/signin");
  };

  if (!user) return null;

  return (
    <SafeAreaView className="bg-black h-full">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View className="flex flex-row items-center p-4 relative">
        <View className="flex flex-row items-center absolute left-4">
          <Image source={images.bgremlogo} className="w-10 h-10" resizeMode="contain" />
        </View>
        <View className="flex-1 flex items-center">
          <Text className="text-xl text-white font-pbold">Profile</Text>
        </View>
      </View>
      <ScrollView>
        <View className="relative">
          <View>
            <Image
              source={images.profbackground}
              className="w-full h-40"
              resizeMode="cover"
            />
          </View>
          <View className="absolute left-4 bottom-0 translate-y-1/2">
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-24 h-24 rounded-full border-4 border-white"
              resizeMode="cover"
            />
          </View>
        </View>
        <View className="px-4 mt-4">
          <Text className="text-2xl text-teal-200 font-psemibold">{user.fullName}</Text>
          <Text className="text-lg text-gray-400 font-psemibold">@{user.name}</Text>
          <Text className="text-md text-gray-200 font-psemibold">{user.email}</Text>
        </View>
        <View className="flex-row justify-between items-center px-6 mt-8">
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-teal-500 items-center justify-center">
              <Text className="text-xl font-bold text-white font-pbold">0</Text>
            </View>
            <Text className="mt-2 text-teal-200 font-plight">Used</Text>
          </View>
          <View className="items-center relative" style={{ top: 20 }}>
            <View className="w-20 h-20 rounded-full bg-teal-500 items-center justify-center">
              <Text className="text-xl font-bold text-white font-pbold">0</Text>
            </View>
            <Text className="mt-2 text-teal-dark font-plight">Scanned</Text>
          </View>
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-teal-500 items-center justify-center">
              <Text className="text-xl font-bold text-white font-pbold">0</Text>
            </View>
            <Text className="mt-2 text-orange font-plight text-red">Inactive</Text>
          </View>
          <Svg height="100" width="100%" style={{ position: 'absolute', top: -13, left: 0, right: 0, zIndex: -1 }}>
            <Path
                d="M45 30 Q 217.5 135, 390 30"
                fill="none"
                stroke="#02807d"
                strokeWidth="4"
            />
          </Svg>


        </View>
        <View className="px-6 mt-8">
          {[
            'Edit Personal Information',
            'Change Password',
            'Invite Friends',
            'Card History',
            'Notifications/Alerts',
            'Contact Support',
            'Follow us on Social Media',
            'Terms of Service',
          ].map((item, index) => (
            <TouchableOpacity key={index} className="bg-gray-800 p-4 mt-3 w-full rounded-lg">
              <Text className="font-pregular text-white">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="px-6 mt-8 items-center">
          <TouchableOpacity
            onPress={logout}
            className="bg-red-600 p-4 rounded-full w-36 items-center"
          >
            <Text className="text-white font-psemibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    lineContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'transparent',
    },
    line: {
        position: 'absolute',
        left: '15%',
        right: '15%',
        height: 1,
        backgroundColor: '#02807d',
    },
    svgLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
    },
});

export default Profile;