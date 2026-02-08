import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../../components/layout/AppHeader';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import AppCard from '../../components/ui/AppCard';
import { userService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { ScreenWrapper } from '../../components/ui/system/SystemComponents';

const SecurityScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdatePassword = async () => {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            showToast('All fields are required', 'error');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        setIsUpdating(true);
        try {
            await userService.updatePassword(passwords);
            showToast('Security updated successfully!', 'success');
            setTimeout(() => navigation.goBack(), 1500);
        } catch (error) {
            showToast(error.message || 'Failed to update credentials', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <ScreenWrapper loading={isUpdating}>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <AppHeader title="Security Protocol" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >
                    <ScrollView
                        className="flex-1 px-5"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingTop: 32,
                            paddingBottom: insets.bottom + 40
                        }}
                    >
                        <View className="items-center mb-10">
                            <Text className="text-xl font-bold text-slate-800 text-center uppercase tracking-tighter">Credential Management</Text>
                            <Text className="text-slate-400 text-center mt-2 font-black uppercase tracking-[2px] text-[10px] px-6">
                                Update your institutional access keys for enhanced workspace security.
                            </Text>
                        </View>

                        <AppCard className="mb-10">
                            <AppInput
                                label="Current Identity Key"
                                placeholder="••••••••"
                                secureTextEntry
                                passwordToggle
                                value={passwords.currentPassword}
                                onChangeText={(t) => setPasswords({ ...passwords, currentPassword: t })}
                            />
                            <AppInput
                                label="New Security Key"
                                placeholder="••••••••"
                                secureTextEntry
                                passwordToggle
                                value={passwords.newPassword}
                                onChangeText={(t) => setPasswords({ ...passwords, newPassword: t })}
                            />
                            <AppInput
                                label="Confirm Security Key"
                                placeholder="••••••••"
                                secureTextEntry
                                passwordToggle
                                value={passwords.confirmPassword}
                                onChangeText={(t) => setPasswords({ ...passwords, confirmPassword: t })}
                            />
                        </AppCard>

                        <View className="mb-10">
                            <AppButton
                                title="Update Access Matrix"
                                onPress={handleUpdatePassword}
                                loading={isUpdating}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

export default SecurityScreen;
