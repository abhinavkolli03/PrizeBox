import { Text, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface TabIconProps {
  icon: string;
  color: string;
  name: string;
  focused: boolean;
  isScan?: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused, isScan }) => {
  return (
    <View style={[styles.iconContainer, isScan && styles.scanIconContainer]}>
      <FontAwesome 
        name={icon}
        size={isScan ? 36 : 24}
        color={isScan ? "#FFFFFF" : color}
        style={isScan && styles.scanIcon}
      />
      {!isScan && (
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs mt-2`}
          style={{ color: color }}
        >
          {name}
        </Text>
      )}
    </View>
  );
}

const TabsLayout: React.FC = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#02807d",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 104,
          },
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon="home"
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="board"
          options={{
            title: 'Board',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon="bookmark"
                color={color}
                name="Board"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="scan"
          options={{
            title: 'Scan',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon="camera"
                color={color}
                name="Scan"
                focused={focused}
                isScan
              />
            )
          }}
        />
        <Tabs.Screen 
          name="share"
          options={{
            title: 'Share',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon="group"
                color={color}
                name="Share"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon="user"
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIconContainer: {
    width: 72, 
    height: 72,
    borderRadius: 36, 
    backgroundColor: '#02807d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scanIcon: {
    color: '#FFFFFF',
  },
});

export default TabsLayout;
