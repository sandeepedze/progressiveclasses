import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AppHeader = ({ title, showBack = true, showNotification = true, useLogo = false }) => {
    const navigation = useNavigation();

    return (
        <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center flex-1">
                {showBack && (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3 p-1.5 rounded-full bg-indigo-50"
                    >
                        <ArrowLeft size={18} color="#6366F1" />
                    </TouchableOpacity>
                )}

                {useLogo ? (
                    <View className="flex-1 items-center justify-center">
                        <Image
                            source={require('../../../assets/logo.png')}
                            className="w-24 h-8"
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <Text className="text-lg font-bold text-slate-800">{title}</Text>
                )}
            </View>

            {showNotification ? (
                <TouchableOpacity className="relative p-2 rounded-full bg-indigo-50">
                    <Bell size={18} color="#6366F1" />
                    <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                </TouchableOpacity>
            ) : (
                /* Empty view to maintain spacing if no notification but showBack is true and useLogo is true */
                useLogo && showBack && <View className="w-10" />
            )}
        </View>
    );
};

export default AppHeader;
