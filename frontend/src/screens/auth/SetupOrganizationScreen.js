import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { Building, MapPin, Phone, Mail, Globe } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services';
import { useDispatch } from 'react-redux';
import { restoreToken } from '../../features/auth/authSlice';

const SetupOrganizationScreen = ({ route, navigation }) => {
    const { eduType } = route.params;
    const { showToast } = useToast();
    const dispatch = useDispatch(); // To refresh user state after setup complete
    const [isLoading, setIsLoading] = useState(false);

    // Auto-fill fields based on type if needed, or just specialized labels
    const typeLabel = eduType?.type_name || 'Organization';

    const [formData, setFormData] = useState({
        organization_name: '',
        contact: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        logo: '' // Keeping simple for now (no file upload UI yet)
    });

    const handleSetup = async () => {
        if (!formData.organization_name || !formData.contact || !formData.address) {
            showToast('Name, contact and address are required.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await authService.setupOrg({
                ...formData,
                edu_type_id: eduType.id
            });

            showToast('Setup complete! Welcome to Dashboard.', 'success');

            // Refresh User Token/State to update 'is_setup_complete'
            await dispatch(restoreToken());

            // Navigation handled by AppNavigator observing state change, or force navigate if needed
            // But restoreToken updates Redux state 'user' which AppNavigator watches. 
            // If user.is_setup_complete becomes true, it should redirect based on Navigator logic.
        } catch (error) {
            showToast(error.message || 'Setup failed', 'error');
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
                >
                    <View className="mb-8">
                        <Text className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            Setup Details
                        </Text>
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Enter {typeLabel} information
                        </Text>
                    </View>

                    <View className="space-y-1">
                        <AppInput
                            label={`${typeLabel} Name`}
                            placeholder={`e.g. Springfield ${typeLabel}`}
                            value={formData.organization_name}
                            onChangeText={(t) => setFormData({ ...formData, organization_name: t })}
                            icon={<Building size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Official Contact Number"
                            placeholder="+91 98765 43210"
                            value={formData.contact}
                            onChangeText={(t) => setFormData({ ...formData, contact: t })}
                            icon={<Phone size={18} color="#6366F1" />}
                            keyboardType="phone-pad"
                        />

                        <AppInput
                            label="Official Email"
                            placeholder="office@school.com"
                            value={formData.email}
                            onChangeText={(t) => setFormData({ ...formData, email: t })}
                            icon={<Mail size={18} color="#6366F1" />}
                        />

                        <AppInput
                            label="Full Address"
                            placeholder="Street, Area, Landmark"
                            value={formData.address}
                            onChangeText={(t) => setFormData({ ...formData, address: t })}
                            icon={<MapPin size={18} color="#6366F1" />}
                            multiline={true}
                        />

                        <View className="flex-row justify-between">
                            <View className="w-[48%]">
                                <AppInput
                                    label="City"
                                    placeholder="Mumbai"
                                    value={formData.city}
                                    onChangeText={(t) => setFormData({ ...formData, city: t })}
                                />
                            </View>
                            <View className="w-[48%]">
                                <AppInput
                                    label="State"
                                    placeholder="Maharashtra"
                                    value={formData.state}
                                    onChangeText={(t) => setFormData({ ...formData, state: t })}
                                />
                            </View>
                        </View>

                        <View className="flex-row justify-between">
                            <View className="w-[48%]">
                                <AppInput
                                    label="Country"
                                    placeholder="India"
                                    value={formData.country}
                                    onChangeText={(t) => setFormData({ ...formData, country: t })}
                                />
                            </View>
                            <View className="w-[48%]">
                                <AppInput
                                    label="Zip Code"
                                    placeholder="400001"
                                    value={formData.zip_code}
                                    onChangeText={(t) => setFormData({ ...formData, zip_code: t })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    <View className="mt-8">
                        <AppButton
                            title="Save & Continue"
                            onPress={handleSetup}
                            loading={isLoading}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SetupOrganizationScreen;
