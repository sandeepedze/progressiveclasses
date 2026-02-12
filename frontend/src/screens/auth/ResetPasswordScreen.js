import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services';

const ResetPasswordScreen = ({ route, navigation }) => {
    const { contact, otp } = route.params;
    const { showToast } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!password || !confirmPassword) {
            showToast('Please fill all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(contact, otp, password);
            showToast('Password updated successfully! Please login.', 'success');
            navigation.navigate('Login');
        } catch (error) {
            showToast(error.message || 'Failed to update password', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
                    <TouchableOpacity
                        className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100"
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={20} color="#64748B" />
                    </TouchableOpacity>

                    <View className="mb-8">
                        <Text className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            New Password
                        </Text>
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Create a strong password
                        </Text>
                    </View>

                    <View className="space-y-1">
                        <AppInput
                            label="New Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            passwordToggle={true}
                            icon={<Lock size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            passwordToggle={true}
                            icon={<CheckCircle size={18} color="#6366F1" />}
                        />
                    </View>

                    <View className="mt-8">
                        <AppButton
                            title="Update Password"
                            onPress={handleUpdatePassword}
                            loading={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;
