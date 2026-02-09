import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { KeyRound, ArrowLeft } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services';

const VerifyOtpScreen = ({ route, navigation }) => {
    const { contact } = route.params;
    const { showToast } = useToast();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            showToast('Please enter the OTP', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await authService.verifyOtp(contact, otp);
            showToast('OTP Verified!', 'success');
            navigation.navigate('ResetPassword', { contact, otp });
        } catch (error) {
            showToast(error.message || 'Invalid OTP', 'error');
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
                            Verify OTP
                        </Text>
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Enter the code sent to {contact}
                        </Text>
                    </View>

                    <AppInput
                        label="OTP Code"
                        placeholder="123456"
                        value={otp}
                        onChangeText={setOtp}
                        icon={<KeyRound size={18} color="#6366F1" />}
                        keyboardType="numeric"
                        maxLength={6}
                    />

                    <View className="mt-6">
                        <AppButton
                            title="Verify OTP"
                            onPress={handleVerify}
                            loading={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerifyOtpScreen;
