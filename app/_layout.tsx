import React, {lazy, Suspense} from "react";

import { NavigationContainer } from "@react-navigation/native";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}} initialRouteName="index">
      <Stack.Screen name="index" />
    </Stack>
  );
}
