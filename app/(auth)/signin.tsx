import { Text, View, ScrollView, Alert, Image, StyleSheet, KeyboardAvoidingView, Platform  } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, signIn } from '../../lib/appwrite';

import FormField from '../components/FormField';
import { images } from '@/constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext, UserProps } from '@/context/GlobalProvider';

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const submit = async () => {
    if (!form.password || !form.email) {
      Alert.alert('Error', "Please fill in all the fields");
      return;
    }

    setSubmitting(true);

    try {  
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      if (result) {
        const userData: UserProps = {
            id: result.$id,
            name: result.username,
            avatarUrl: result.avatar,
            email: result.email,
            fullName: result.fullName
        };
        setUser(userData);
        setIsLoggedIn(true);
        router.replace('/home');
      } else {
        throw new Error("Sign in failed.");
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-black-100 h-full">
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
    >
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} className="w-[115px] h-[115px] rounded-full overflow-hidden" />
          <Text className="text-2xl text-white mb-8 font-semibold mt-10 font-psemibold">Log In to PrizeBox</Text>
          
          <FormField 
            title="Email"
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={(e) => setForm({ 
              ...form,
              email: e
            })}
            otherStyles={styles.formField}
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            placeholder="Enter your password"
            handleChangeText={(e) => setForm({ 
              ...form,
              password: e
            })}
            otherStyles={styles.formField}
            keyboardType="default"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles='mt-7 bg-teal text-white'
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-m text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/signup" className="text-m font-psemibold text-teal-dark">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    formField: {
      marginTop: 7,
    },
});

export default SignIn;
