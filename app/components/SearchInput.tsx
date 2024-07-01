import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { icons } from '@/constants';

const SearchInput = ({ initialQuery, onSearch }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || '');

  const handleSearch = (text) => {
    setQuery(text);
    onSearch(text);
  }

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-teal">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search cards..."
        placeholderTextColor="#CDCDE0"
        onChangeText={handleSearch}
      />
      <TouchableOpacity onPress={() => handleSearch(query)}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
