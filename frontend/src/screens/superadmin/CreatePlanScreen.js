import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import AppHeader from '../../components/layout/AppHeader';
import { useApiMutation } from '../../hooks/useApiMutation';
import { subscriptionService } from '../../services';
import AppCard from '../../components/ui/AppCard';
import { ScreenWrapper } from '../../components/ui/system/SystemComponents';

const CreatePlanScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [form, setForm] = useState({
        plan_name: '',
        price_monthly: '',
        price_yearly: '',
        max_users: '10',
        max_students: '100',
        storage_limit_gb: '5',
        trial_days: '14'
    });

    const createPlanApi = subscriptionService?.createPlan || (async () => ({ success: true }));

    const { mutate, isLoading } = useApiMutation(createPlanApi, {
        successMessage: 'Product SKU catalog updated successfully!',
        onSuccess: () => navigation.goBack()
    });

    const handleSubmit = () => {
        if (!form.plan_name || !form.price_monthly) return Alert.alert('Error', 'Essential Plan Metadata Missing');
        mutate({
            ...form,
            price_monthly: parseFloat(form.price_monthly),
            price_yearly: parseFloat(form.price_yearly || 0),
            max_users: parseInt(form.max_users),
            max_students: parseInt(form.max_students),
            storage_limit_gb: parseInt(form.storage_limit_gb),
            trial_days: parseInt(form.trial_days)
        });
    };

    return (
        <ScreenWrapper loading={isLoading}>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <AppHeader title="Package Specification" />

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
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Plan Identifier</Text>
                        <AppCard className="mb-6">
                            <AppInput
                                label="Strategic Plan Name"
                                placeholder="e.g. Enterprise Gold"
                                value={form.plan_name}
                                onChangeText={t => setForm({ ...form, plan_name: t })}
                            />
                        </AppCard>

                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Pricing Architecture (₹)</Text>
                        <AppCard className="mb-6">
                            <View className="flex-row justify-between">
                                <View className="w-[48%]">
                                    <AppInput
                                        label="Monthly Fee"
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={form.price_monthly}
                                        onChangeText={t => setForm({ ...form, price_monthly: t })}
                                    />
                                </View>
                                <View className="w-[48%]">
                                    <AppInput
                                        label="Annual Accrual"
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={form.price_yearly}
                                        onChangeText={t => setForm({ ...form, price_yearly: t })}
                                    />
                                </View>
                            </View>
                        </AppCard>

                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Operational Scalability</Text>
                        <AppCard className="mb-10">
                            <View className="flex-row justify-between">
                                <View className="w-[48%]">
                                    <AppInput
                                        label="Staff Seats"
                                        placeholder="10"
                                        keyboardType="numeric"
                                        value={form.max_users}
                                        onChangeText={t => setForm({ ...form, max_users: t })}
                                    />
                                </View>
                                <View className="w-[48%]">
                                    <AppInput
                                        label="Student Quota"
                                        placeholder="100"
                                        keyboardType="numeric"
                                        value={form.max_students}
                                        onChangeText={t => setForm({ ...form, max_students: t })}
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-between">
                                <View className="w-[48%]">
                                    <AppInput
                                        label="Storage (GBs)"
                                        placeholder="5"
                                        keyboardType="numeric"
                                        value={form.storage_limit_gb}
                                        onChangeText={t => setForm({ ...form, storage_limit_gb: t })}
                                    />
                                </View>
                                <View className="w-[48%]">
                                    <AppInput
                                        label="Trial Window"
                                        placeholder="14"
                                        keyboardType="numeric"
                                        value={form.trial_days}
                                        onChangeText={t => setForm({ ...form, trial_days: t })}
                                    />
                                </View>
                            </View>
                        </AppCard>

                        {/* Submit Button inside ScrollView */}
                        <View className="mb-10">
                            <AppButton
                                title="Commit Package to Registry"
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

export default CreatePlanScreen;
