import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services';

const ForgotPasswordScreen = ({ navigation }) => {
    const { showToast } = useToast();
    const [contact, setContact] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!contact) {
            showToast('Please enter your email or phone', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword(contact);
            showToast('OTP sent successfully!', 'success');
            navigation.navigate('VerifyOtp', { contact });
        } catch (error) {
            showToast(error.message || 'Failed to send OTP', 'error');
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
                            Forgot Password
                        </Text>
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Enter your email or phone to receive OTP
                        </Text>
                    </View>

                    <AppInput
                        label="Email or Phone"
                        placeholder="admin@school.com"
                        value={contact}
                        onChangeText={setContact}
                        icon={<Mail size={18} color="#6366F1" />}
                    />

                    <View className="mt-6">
                        <AppButton
                            title="Send OTP"
                            onPress={handleSendOtp}
                            loading={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
