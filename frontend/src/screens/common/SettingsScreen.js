import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    User, Lock, Bell, HelpCircle,
    FileText, LogOut, ChevronRight
} from 'lucide-react-native';

import AppHeader from '../../components/layout/AppHeader';
import { logoutUser } from '../../features/auth/authSlice';
import * as SecureStore from 'expo-secure-store';
import { useToast } from '../../context/ToastContext';
import { API_CONFIG } from '../../constants/apiRoutes';

const SettingsRow = ({ icon, label, onPress, subLabel }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between bg-white px-5 py-4 rounded-[20px] border border-slate-50 mb-3"
    >
        <View className="flex-row items-center flex-1">
            <View className="bg-indigo-50 p-2.5 rounded-xl mr-4">
                {icon}
            </View>
            <View>
                <Text className="text-sm font-bold text-slate-800 uppercase tracking-tight">{label}</Text>
                {subLabel && <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subLabel}</Text>}
            </View>
        </View>
        <View className="bg-indigo-50 p-1 rounded-full">
            <ChevronRight size={14} color="#6366F1" />
        </View>
    </TouchableOpacity>
);

const SettingsScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { user } = useSelector(state => state.auth);
    const { showToast } = useToast();

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
            await dispatch(logoutUser()).unwrap();
            showToast('Logged out successfully', 'success');
        } catch (error) {
            showToast('Logout failed', 'error');
        }
    };

    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const host = API_CONFIG.BASE_URL.replace('/api', '');
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${host}/${cleanPath}`;
    };

    const profileImageUrl = getFullImageUrl(user?.profile_image);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader useLogo={true} showBack={false} />

            <View className="px-5 py-6 bg-white border-b border-gray-50">
                <Text className="text-xl font-bold text-slate-800">Account Preferences</Text>
            </View>

            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingBottom: insets.bottom + 100
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Peek */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Profile')}
                    className="flex-row items-center bg-[#6366F1] p-5 rounded-[24px] mb-8 shadow-lg shadow-indigo-100"
                >
                    <View className="h-14 w-14 rounded-2xl bg-white/20 items-center justify-center border-2 border-white/30 overflow-hidden mr-4">
                        {profileImageUrl ? (
                            <Image
                                source={{ uri: profileImageUrl }}
                                className="h-full w-full"
                            />
                        ) : (
                            <User size={28} color="white" />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-white uppercase tracking-tight">{user?.name}</Text>
                        <Text className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mt-1">{user?.email}</Text>
                    </View>
                    <View className="bg-white/20 p-2 rounded-full">
                        <ChevronRight size={16} color="white" />
                    </View>
                </TouchableOpacity>

                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Identity & Security</Text>

                <SettingsRow
                    icon={<User size={18} color="#6366F1" />}
                    label="Personal Information"
                    subLabel="Profile & Contacts"
                    onPress={() => navigation.navigate('Profile')}
                />

                <SettingsRow
                    icon={<Lock size={18} color="#6366F1" />}
                    label="Security & Access"
                    subLabel="Update Secret Key"
                    onPress={() => navigation.navigate('Security')}
                />

                <SettingsRow
                    icon={<Bell size={18} color="#6366F1" />}
                    label="Notifications"
                    onPress={() => { }}
                />

                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-4 ml-1">Institutional Support</Text>

                <SettingsRow
                    icon={<HelpCircle size={18} color="#6366F1" />}
                    label="Nova Support Hub"
                    onPress={() => { }}
                />

                <SettingsRow
                    icon={<FileText size={18} color="#6366F1" />}
                    label="Terms of Service"
                    onPress={() => { }}
                />

                <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-center bg-red-50 py-4 rounded-[20px] border border-red-100 mt-8"
                >
                    <LogOut size={18} color="#EF4444" className="mr-3" />
                    <Text className="text-red-500 font-black text-[10px] uppercase tracking-widest">Terminate Session</Text>
                </TouchableOpacity>

                <Text className="text-center text-slate-300 text-[8px] font-black mt-10 uppercase tracking-[4px]">
                    Nova Engine v1.0.110
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
