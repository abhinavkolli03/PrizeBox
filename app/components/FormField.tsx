import { Text, View, TextInput, StyleProp, TextInputProps, TouchableOpacity, Image, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: StyleProp<ViewStyle>;
  keyboardType?: TextInputProps['keyboardType'];
}

const FormField: React.FC<FormFieldProps> = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[{ marginTop: 16 }, otherStyles]}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      
      <View className="w-full h-16 px-4 mt-3 mb-3 bg-black-100 rounded-2xl border-2 
          border-black-200 focus:border-teal-dark flex flex-row items-center">
        <TextInput 
          style={{ height: 20, width: '100%' }}
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default FormField;
