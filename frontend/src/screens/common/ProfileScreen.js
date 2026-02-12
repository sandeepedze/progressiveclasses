import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, User as UserIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { restoreToken, setProfileImage, logoutUser } from '../../features/auth/authSlice';
import { userService } from '../../services';
import { useToast } from '../../context/ToastContext';
import AppHeader from '../../components/layout/AppHeader';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import LogoutButton from '../../components/common/LogoutButton';
import { API_CONFIG } from '../../constants/apiRoutes';

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const { user } = useSelector(state => state.auth);

    const [name, setName] = useState(user?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLogout = async () => {
        try {
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

    const handleUpdateProfile = async () => {
        if (!name) {
            showToast('Name cannot be empty.', 'error');
            return;
        }
        setIsUpdating(true);
        try {
            await userService.updateProfile(name);
            await dispatch(restoreToken()).unwrap();
            showToast('Account details updated!', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to update profile.', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            handleUploadAvatar(result.assets[0]);
        }
    };

    const handleUploadAvatar = async (imageAsset) => {
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append('avatar', {
                uri: imageAsset.uri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });

            const response = await userService.uploadAvatar(formData);
            dispatch(setProfileImage(response.url));

            const updatedUser = { ...user, profile_image: response.url };
            await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));

            showToast('Profile picture updated!', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to upload image.', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader title="Identity Suite" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingTop: 32,
                        paddingBottom: insets.bottom + 60
                    }}
                >
                    {/* Centered Avatar */}
                    <View className="items-center mb-10">
                        <View className="relative">
                            <View className="h-28 w-28 rounded-3xl bg-indigo-50 items-center justify-center border-4 border-white shadow-xl shadow-indigo-100 overflow-hidden">
                                {profileImageUrl ? (
                                    <Image
                                        source={{ uri: profileImageUrl }}
                                        key={profileImageUrl}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <UserIcon size={44} color="#6366F1" />
                                )}
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handlePickImage}
                                disabled={isUpdating}
                                className="absolute -bottom-2 -right-2 bg-[#6366F1] p-2.5 rounded-2xl border-2 border-white shadow-md"
                            >
                                <Camera size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="items-center mt-6">
                            <Text className="text-xl font-bold text-slate-900 uppercase tracking-tight">{user?.name}</Text>
                            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mt-1">{user?.email}</Text>
                        </View>
                    </View>

                    {/* Personal Information Section */}
                    <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 mb-6">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">Legal Attributes</Text>

                        <AppInput
                            label="Full Identity Name"
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                        />

                        <View className="opacity-50">
                            <AppInput
                                label="Registered Email"
                                value={user?.email}
                                editable={false}
                            />
                        </View>
                    </View>

                    {/* Action Button */}
                    <View className="mt-2">
                        <AppButton
                            title="Commit Profile Updates"
                            onPress={handleUpdateProfile}
                            loading={isUpdating}
                        />
                        <TouchableOpacity className="mt-6 p-2 items-center opacity-30">
                            <Text className="text-slate-500 text-[8px] font-black uppercase tracking-[3px]">Nova Persistence ID: {user?.id || 'N/A'}</Text>
                        </TouchableOpacity>

                        <View className="mb-8">
                            <LogoutButton onLogout={handleLogout} />
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProfileScreen;