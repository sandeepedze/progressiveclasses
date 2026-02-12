import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { Mail, Lock, User, Phone, CheckCircle } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';

const RegisterScreen = ({ navigation }) => {
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleRegister = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            showToast('All fields are required.', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // Call API
            const response = await authService.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            showToast('Registration successful! Logging you in...', 'success');

            // Check if response contains token and user directly (Optimization)
            if (response?.token && response?.user) {
                // MANUALLY SAVE TO SECURE STORE so apiClient interceptor can pick it up
                await SecureStore.setItemAsync('userToken', response.token);
                await SecureStore.setItemAsync('userData', JSON.stringify(response.user));

                // Manually set state to avoid network call
                dispatch({
                    type: 'auth/loginUser/fulfilled',
                    payload: { user: response.user, token: response.token }
                });
            } else {
                // Fallback to login call
                await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
            }

            // AppNavigator will handle redirection based on state
        } catch (error) {
            showToast(error.message || 'Registration failed', 'error');
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
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="items-center mt-4">
                        <Text className="text-2xl font-black text-slate-900 text-center uppercase tracking-tighter">
                            Start Journey
                        </Text>
                        <Text className="text-slate-400 text-center mt-2 font-black uppercase tracking-[2px] text-[10px] mb-8">
                            Create your admin account
                        </Text>
                    </View>

                    <View className="space-y-1">
                        <AppInput
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChangeText={(t) => setFormData({ ...formData, name: t })}
                            icon={<User size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Email"
                            placeholder="admin@domain.com"
                            value={formData.email}
                            onChangeText={(t) => setFormData({ ...formData, email: t })}
                            icon={<Mail size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Phone Number"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChangeText={(t) => setFormData({ ...formData, phone: t })}
                            icon={<Phone size={18} color="#6366F1" />}
                            keyboardType="phone-pad"
                        />

                        <AppInput
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChangeText={(t) => setFormData({ ...formData, password: t })}
                            secureTextEntry={true}
                            passwordToggle={true}
                            icon={<Lock size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChangeText={(t) => setFormData({ ...formData, confirmPassword: t })}
                            secureTextEntry={true}
                            passwordToggle={true} // Reusing password toggle
                            icon={<CheckCircle size={18} color="#6366F1" />}
                        />
                    </View>

                    <View className="mt-4">
                        <AppButton
                            title="Create Account"
                            onPress={handleRegister}
                            loading={isLoading}
                        />

                        <TouchableOpacity
                            className="mt-6 flex-row justify-center"
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                Already have an account?{' '}
                            </Text>
                            <Text className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                                Login here
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
