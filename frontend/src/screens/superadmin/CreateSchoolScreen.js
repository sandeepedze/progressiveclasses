import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../../components/layout/AppHeader';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import AppCard from '../../components/ui/AppCard';
import { useApiMutation } from '../../hooks/useApiMutation';
import { schoolService } from '../../services';
import { ScreenWrapper } from '../../components/ui/system/SystemComponents';
import { AppFormError } from '../../components/ui/forms/AppFormError';

const CreateSchoolScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [form, setForm] = useState({
        school_name: '',
        school_code: '',
        email: '',
        phone: '',
        address: '',
        admin_name: '',
        admin_email: '',
        admin_password: ''
    });

    const { mutate, isLoading, error } = useApiMutation(schoolService.createSchool, {
        successMessage: 'Entity established successfully!',
        onSuccess: () => {
            setTimeout(() => navigation.goBack(), 1000);
        }
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = () => {
        mutate(form);
    };

    return (
        <ScreenWrapper loading={isLoading}>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <AppHeader title="Onboard New Workspace" />

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
                            paddingTop: 24,
                            paddingBottom: insets.bottom + 40
                        }}
                    >
                        <AppFormError error={error} />

                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Institutional Profile</Text>
                        <AppCard className="mb-6">
                            <AppInput
                                label="Official School Name"
                                placeholder="e.g. Springfield Academy"
                                value={form.school_name}
                                onChangeText={(t) => handleChange('school_name', t)}
                            />
                            <AppInput
                                label="Unique Workspace Code"
                                placeholder="e.g. SF001"
                                value={form.school_code}
                                onChangeText={(t) => handleChange('school_code', t)}
                            />
                            <AppInput
                                label="Corporate Email"
                                placeholder="contact@school.com"
                                value={form.email}
                                onChangeText={(t) => handleChange('email', t)}
                            />
                            <AppInput
                                label="Official Phone"
                                placeholder="+91..."
                                value={form.phone}
                                onChangeText={(t) => handleChange('phone', t)}
                            />
                            <AppInput
                                label="Registered Address"
                                placeholder="Physical Location"
                                value={form.address}
                                onChangeText={(t) => handleChange('address', t)}
                                multiline={true}
                            />
                        </AppCard>

                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Administrative Credentials</Text>
                        <AppCard className="mb-10">
                            <AppInput
                                label="Administrator Name"
                                placeholder="Full Name"
                                value={form.admin_name}
                                onChangeText={(t) => handleChange('admin_name', t)}
                            />
                            <AppInput
                                label="Administrative Email"
                                placeholder="admin@school.com"
                                value={form.admin_email}
                                onChangeText={(t) => handleChange('admin_email', t)}
                            />
                            <AppInput
                                label="Initial Access Key"
                                placeholder="Strong Security Token"
                                value={form.admin_password}
                                onChangeText={(t) => handleChange('admin_password', t)}
                                secureTextEntry={true}
                                passwordToggle={true}
                            />
                        </AppCard>

                        {/* Submit Button inside ScrollView to avoid covering inputs */}
                        <View className="mb-10">
                            <AppButton
                                title="Commit New Entity"
                                onPress={handleSubmit}
                                loading={isLoading}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

export default CreateSchoolScreen;
