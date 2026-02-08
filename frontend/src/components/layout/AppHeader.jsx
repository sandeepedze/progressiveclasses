import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { useSelector } from 'react-redux';

const AppHeader = ({ title, showBack = false }) => {
    const navigation = useNavigation();
    const { user } = useSelector(state => state.auth);
    const avatarUri = user?.profile_image;

    return (
        <View className="px-5 py-4 flex-row justify-between items-center bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
            <View className="flex-row items-center">
                {showBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>
                )}
                <View>
                    <Text className="text-slate-500 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">{title}</Text>
                    <Text className="text-2xl font-bold text-slate-800 dark:text-white">{user?.name || 'User'}</Text>
                </View>
            </View>
            <View className="flex-row items-center">
                <View className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full items-center justify-center shadow-sm border border-gray-100 dark:border-slate-600 mr-3">
                    <Bell size={20} color="#1F2937" />
                </View>
                <Image
                    source={{
                        uri: avatarUri || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    }}
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
            </View>
        </View>
    );
};

export default AppHeader;
