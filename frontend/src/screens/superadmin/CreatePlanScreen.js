import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import AppHeader from '../../components/layout/AppHeader';
import apiClient from '../../services/apiClient';
import { authService } from '../../services';
import { API_ROUTES } from '../../constants/apiRoutes';
import { useToast } from '../../context/ToastContext';
import { Picker } from '@react-native-picker/picker'; // Using picker for edu_type and duration ENUMs

const CreatePlanScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const editPlan = route.params?.plan;
    const isEditing = !!editPlan;

    // Get passed edu_type from navigation (from Tab selection)
    const predefinedEduId = route.params?.edu_type_id;
    const predefinedEduLabel = route.params?.edu_type_label;

    // Fixed ENUMs to match backend exactly
    const [eduTypes, setEduTypes] = useState([]);
    const [isLoadingTypes, setIsLoadingTypes] = useState(true);

    const [durations] = useState([
        { label: '7 Days Trial', value: '7_days' },
        { label: '3 Months', value: '3_months' },
        { label: '6 Months', value: '6_months' },
        { label: '12 Months', value: '12_months' },
        { label: 'Lifetime', value: 'lifetime' },
    ]);

    const [form, setForm] = useState({
        plan_name: '',
        price: '',
        duration: '7_days', // default
        edu_type_id: predefinedEduId || 1,
        features: [],
        status: 1 // 1 for active, 0 for inactive
    });
    const [featureInput, setFeatureInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Edu Types on Mount
    useEffect(() => {
        const loadEduTypes = async () => {
            try {
                const response = await authService.getEduTypes();
                if (Array.isArray(response)) {
                    setEduTypes(response);
                    // If creating new and no predefined type, default to first fetched type
                    if (!isEditing && !predefinedEduId && response.length > 0) {
                        setForm(prev => ({ ...prev, edu_type_id: response[0].id }));
                    }
                }
            } catch (error) {
                console.error('Failed to load edu types:', error);
                showToast('Failed to load education types', 'error');
            } finally {
                setIsLoadingTypes(false);
            }
        };
        loadEduTypes();
    }, []);

    useEffect(() => {
        if (editPlan) {
            let parsedFeatures = [];
            try {
                const parsed = JSON.parse(editPlan.features);
                if (Array.isArray(parsed)) parsedFeatures = parsed;
                // If it's an object (legacy), convert to array of strings "key: value"
                else if (typeof parsed === 'object') parsedFeatures = Object.entries(parsed).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
            } catch (e) {
                // If parsing fails or it's just a string, maybe treat as single item? Or leave empty.
            }

            setForm({
                plan_name: editPlan.plan_name,
                price: editPlan.price.toString(),
                duration: editPlan.duration,
                edu_type_id: editPlan.edu_type_id,
                features: parsedFeatures,
                status: editPlan.status
            });
        }
    }, [editPlan]);

    const addFeature = () => {
        if (featureInput.trim()) {
            setForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async () => {
        if (!form.plan_name || !form.price) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (parseFloat(form.price) < 0) {
            Alert.alert('Error', 'Price must be 0 or greater');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                // duration is now string ENUM, passed as is
                // edu_type_id passed as is
            };

            if (isEditing) {
                await apiClient.put(API_ROUTES.ADMIN.SUBSCRIPTION.UPDATE(editPlan.id), payload);
                showToast('Plan updated successfully', 'success');
            } else {
                await apiClient.post(API_ROUTES.ADMIN.SUBSCRIPTION.CREATE, payload);
                showToast('Plan created successfully', 'success');
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showToast('Failed to save plan', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader title={isEditing ? "Edit Plan" : `New ${predefinedEduLabel || ''} Plan`} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}>
                    <AppInput
                        label="Plan Name"
                        value={form.plan_name}
                        onChangeText={t => setForm({ ...form, plan_name: t })}
                        placeholder="e.g. Standard School Plan"
                    />

                    <View className="flex-row justify-between gap-4 mt-4 mb-4">
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-slate-500 uppercase mb-2">Education Type</Text>
                            {/* If predefined (creating new under a tab), disable selection or show inactive picker */}
                            <View className={`border border-gray-200 rounded-xl bg-gray-50 ${predefinedEduId && !isEditing ? 'opacity-50' : ''}`}>
                                <Picker
                                    selectedValue={form.edu_type_id}
                                    onValueChange={(itemValue) => !predefinedEduId || isEditing ? setForm({ ...form, edu_type_id: itemValue }) : null}
                                    enabled={(!predefinedEduId || isEditing) && !isLoadingTypes}
                                    style={{ height: 50 }}
                                >
                                    {isLoadingTypes ? (
                                        <Picker.Item label="Loading types..." value={null} />
                                    ) : (
                                        eduTypes.map((type) => (
                                            <Picker.Item key={type.id} label={type.type_name} value={type.id} style={{ fontSize: 14 }} />
                                        ))
                                    )}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row justify-between gap-4">
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-slate-500 uppercase mb-2">Duration</Text>
                            <View className="border border-gray-200 rounded-xl bg-gray-50">
                                <Picker
                                    selectedValue={form.duration}
                                    onValueChange={(itemValue) => setForm({ ...form, duration: itemValue })}
                                    style={{ height: 50 }}
                                >
                                    {durations.map((d) => (
                                        <Picker.Item key={d.value} label={d.label} value={d.value} style={{ fontSize: 14 }} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View className="flex-1">
                            <AppInput
                                label="Price (₹)"
                                value={form.price}
                                onChangeText={t => setForm({ ...form, price: t })}
                                keyboardType="numeric"
                                placeholder="0.00"
                            />
                        </View>
                    </View>

                    <Text className="text-xs font-bold text-slate-500 uppercase mt-6 mb-2">Features</Text>
                    <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                            <AppInput
                                value={featureInput}
                                onChangeText={setFeatureInput}
                                placeholder="Add a feature..."
                                onSubmitEditing={addFeature}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={addFeature}
                            className="bg-indigo-100 w-12 h-12 rounded-xl items-center justify-center mt-1"
                        >
                            <Plus size={24} color="#6366F1" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap gap-2 mb-6">
                        {form.features.map((feat, index) => (
                            <View key={index} className="bg-gray-100 px-3 py-1 rounded-full flex-row items-center border border-gray-200">
                                <Text className="text-xs font-bold text-slate-700 mr-2">{feat}</Text>
                                <TouchableOpacity onPress={() => removeFeature(index)}>
                                    <X size={12} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <AppButton
                        title={isEditing ? "Update Plan" : "Create Plan"}
                        onPress={handleSubmit}
                        loading={isLoading}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreatePlanScreen;
