import React, { useState } from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { Mail, Lock } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { isActionLoading } = useSelector(state => state.auth);
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const devShortcuts = [
        {
            label: 'Super Admin',
            email: 'superadmin@edu.com',
            password: '123',
            className: 'bg-indigo-50 border-indigo-100 shadow-indigo-100',
            textClass: 'text-indigo-600',
            subTextClass: 'text-indigo-300'
        },
        {
            label: 'Couching Admin',
            email: 'admin@progressive.com',
            password: '123',
            className: 'bg-slate-50 border-slate-100 shadow-slate-100',
            textClass: 'text-slate-700',
            subTextClass: 'text-slate-400'
        }
    ];

    const handleLogin = async (creds = credentials) => {
        if (!creds.email || !creds.password) {
            showToast('Email and Password cannot be empty.', 'error');
            return;
        }
        try {
            await dispatch(loginUser(creds)).unwrap();
            showToast('Login successful! Welcome back.', 'success');
        } catch (err) {
            console.error('Login Screen Error:', err);
            showToast(err.message || err || 'Login failed', 'error');
        }
    };

    const handleDevShortcut = (email, password) => {
        const creds = { email, password };
        setCredentials(creds);
        handleLogin(creds);
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="items-center">
                        {/* Branding Logo */}
                        <View className="h-28 w-28 bg-white rounded-[32px] mb-4 items-center justify-center shadow-xl shadow-indigo-100 border border-slate-50 overflow-hidden">
                            <Image
                                source={require('../../../assets/logo.png')}
                                className="h-20 w-20"
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-2xl font-black text-center uppercase tracking-tighter">
                            <Text className="text-4xl text-indigo-800">N</Text>ova <Text className="text-4xl text-indigo-800">C</Text>ampus
                        </Text>

                        <Text className="text-gray-500 text-center mt-2 font-black uppercase tracking-[3px] text-[10px]">Enterprise Management
                        </Text>
                    </View>

                    <View className="space-y-1 mt-8">
                        <AppInput
                            label="Email"
                            placeholder="name@nova.com"
                            value={credentials.email}
                            onChangeText={(t) => setCredentials({ ...credentials, email: t })}
                            icon={<Mail size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChangeText={(t) => setCredentials({ ...credentials, password: t })}
                            secureTextEntry={true}
                            passwordToggle={true}
                            icon={<Lock size={18} color="#6366F1" />}
                        />
                    </View>

                    <View className="mt-2">
                        <AppButton
                            title="Login"
                            onPress={() => handleLogin()}
                            loading={isActionLoading}
                        />
                        <TouchableOpacity
                            className="mt-6 flex-row justify-center"
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                Forgot your password?{' '}
                            </Text>
                            <Text className="text-indigo-700 font-bold text-[10px] uppercase tracking-widest">
                                Reset here
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Developer Console Shortcuts */}
                    <View className="mt-5">
                        <View className="flex-row items-center mb-4">
                            <View className="flex-1 h-[1px] bg-indigo-700" />
                            <Text className="text-[10px] font-black text-indigo-700 mx-4 uppercase tracking-[1px]">
                                Don't have an account?{' '}
                            </Text>
                            <View className="flex-1 h-[1px] bg-indigo-700" />
                        </View>

                        <View className="mb-4">
                            <AppButton
                                title="Register"
                                onPress={() => navigation.navigate('Register')}
                                variant="outline"
                            />
                        </View>

                        <View className="flex-row flex-wrap justify-between">
                            {devShortcuts.map((shortcut, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleDevShortcut(shortcut.email, shortcut.password)}
                                    className={`w-[48%] p-2 rounded-md mb-2 border items-center shadow-sm ${shortcut.className}`}
                                >
                                    <Text className={`font-black text-[11px] capitalize tracking-widest ${shortcut.textClass}`}>
                                        {shortcut.label}
                                    </Text>
                                    <Text className={`text-[11px] font-bold mt-1 ${shortcut.subTextClass}`}>
                                        {shortcut.email}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
