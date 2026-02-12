import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Grid, MessageCircle, User } from 'lucide-react-native';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const CirclesScreen = () => (
    <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-bold text-lg">Circles</Text>
    </View>
);

const SocialScreen = () => (
    <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-bold text-lg">Social</Text>
    </View>
);

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 80 + (insets.bottom || 0),
                    paddingTop: 10,
                    paddingBottom: Math.max(16, (insets.bottom || 0) + 8),
                    backgroundColor: 'white',
                    borderTopWidth: 0,
                    elevation: 10, // Shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
                tabBarActiveTintColor: '#000000', // Black for active
                tabBarInactiveTintColor: '#9CA3AF', // Gray for inactive
            }}
        >
            <Tab.Screen
                name="Home"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Circles"
                component={CirclesScreen}
                options={{
                    tabBarLabel: 'Circles',
                    tabBarIcon: ({ color, size }) => (
                        <Grid size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Social"
                component={SocialScreen}
                options={{
                    tabBarLabel: 'Social',
                    tabBarIcon: ({ color, size }) => (
                        <MessageCircle size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <User size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
