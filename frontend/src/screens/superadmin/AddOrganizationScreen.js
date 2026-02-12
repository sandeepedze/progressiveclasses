import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import AppHeader from '../../components/layout/AppHeader';
import apiClient from '../../services/apiClient';
import { API_ROUTES } from '../../constants/apiRoutes';
import { useToast } from '../../context/ToastContext';
import { Picker } from '@react-native-picker/picker';

const AddOrganizationScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // We need map for eduTypes: Schools=2, Institutes=3, Coaching=4, Tuition=5 (based on my backend assumption)
    // Ideally fetch from backend, but fixed dropdown valid for now
    const [eduTypes, setEduTypes] = useState([
        { label: 'School', value: 2 },
        { label: 'Institute', value: 3 },
        { label: 'Coaching', value: 4 },
        { label: 'Tuition', value: 5 },
    ]);

    const [form, setForm] = useState({
        organization_name: '',
        edu_type_id: 2,
        owner_name: '',
        email: '',
        mobile: '',
        password: '',
        address: '',
        status: 'Active'
    });

    const handleSubmit = async () => {
        if (!form.organization_name || !form.email || !form.mobile || !form.password) {
            Alert.alert('Error', 'Please fill required fields');
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post(API_ROUTES.ADMIN.ORGANIZATION.CREATE, form);
            showToast('Organization created successfully', 'success');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showToast('Failed to create organization', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader title="Add Organization" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}>
                    <AppInput
                        label="Organization Name"
                        value={form.organization_name}
                        onChangeText={t => setForm({ ...form, organization_name: t })}
                        placeholder="e.g. Springfield High"
                    />

                    <Text className="text-xs font-bold text-slate-500 uppercase mt-4 mb-2">Organization Type</Text>
                    <View className="border border-gray-200 rounded-xl mb-4 bg-gray-50">
                        <Picker
                            selectedValue={form.edu_type_id}
                            onValueChange={(itemValue) => setForm({ ...form, edu_type_id: itemValue })}
                        >
                            {eduTypes.map((type) => (
                                <Picker.Item key={type.value} label={type.label} value={type.value} />
                            ))}
                        </Picker>
                    </View>

                    <AppInput
                        label="Owner Name"
                        value={form.owner_name}
                        onChangeText={t => setForm({ ...form, owner_name: t })}
                        placeholder="Full Name"
                    />

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <AppInput
                                label="Email"
                                value={form.email}
                                onChangeText={t => setForm({ ...form, email: t })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View className="flex-1">
                            <AppInput
                                label="Mobile"
                                value={form.mobile}
                                onChangeText={t => setForm({ ...form, mobile: t })}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <AppInput
                        label="Password"
                        value={form.password}
                        onChangeText={t => setForm({ ...form, password: t })}
                        secureTextEntry
                        placeholder="Min 6 chars"
                    />

                    <AppInput
                        label="Address"
                        value={form.address}
                        onChangeText={t => setForm({ ...form, address: t })}
                        multiline
                        numberOfLines={3}
                        height={80}
                    />

                    <Text className="text-xs font-bold text-slate-500 uppercase mt-4 mb-2">Status</Text>
                    <View className="border border-gray-200 rounded-xl mb-6 bg-gray-50">
                        <Picker
                            selectedValue={form.status}
                            onValueChange={(itemValue) => setForm({ ...form, status: itemValue })}
                        >
                            <Picker.Item label="Active" value="Active" />
                            <Picker.Item label="Inactive" value="Inactive" />
                        </Picker>
                    </View>

                    <AppButton
                        title="Create Organization"
                        onPress={handleSubmit}
                        loading={isLoading}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddOrganizationScreen;
