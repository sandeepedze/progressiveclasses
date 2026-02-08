import React from 'react';
import { View, Text, Image } from 'react-native';
import { User } from 'lucide-react-native';
import { API_CONFIG } from '../../constants/apiRoutes';

const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const host = API_CONFIG.BASE_URL.replace('/api', '');
    return `${host}/${path}`;
};

const ProfileHeaderCard = ({ user }) => {
    const profileImageUrl = getFullImageUrl(user?.profile_image);
    const roleDisplay = (user?.role_name || user?.role_code || 'Guest').toUpperCase().replace('_', ' ');

    return (
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 items-center mb-6 w-full">
            <View className="h-24 w-24 rounded-full bg-slate-100 items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
                {profileImageUrl ? (
                    <Image source={{ uri: profileImageUrl }} className="h-full w-full" style={{ borderRadius: 48 }} resizeMode="cover" />
                ) : (
                    <User size={40} color="#64748B" />
                )}
            </View>
            <Text className="text-xl font-bold text-slate-900">{user?.name || 'User'}</Text>
            <Text className="text-slate-500 mb-2">{user?.email}</Text>
            <View className="bg-indigo-50 px-4 py-1 rounded-full">
                <Text className="text-indigo-600 text-xs font-extrabold tracking-widest">
                    {roleDisplay}
                </Text>
            </View>
        </View>
    );
};

export default ProfileHeaderCard;
