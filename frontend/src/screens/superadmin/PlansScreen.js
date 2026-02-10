import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Edit2, Trash2, Power, CheckCircle, XCircle } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import AppHeader from '../../components/layout/AppHeader';
import apiClient from '../../services/apiClient';
import { authService } from '../../services';
import { API_ROUTES } from '../../constants/apiRoutes';

const parseFeatures = (features) => {
    try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') return Object.entries(parsed).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
        return [features];
    } catch {
        return [features]; // Return as single item array if string
    }
};

import AppButton from '../../components/ui/AppButton';

const PlanCard = ({ plan, onEdit, onDelete, onToggleStatus }) => {
    const features = parseFeatures(plan.features);
    const isActive = plan.status === 1;

    return (
        <View className={`rounded-2xl p-5 mb-4 shadow-sm border ${isActive ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
            {/* Header */}
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className={`text-lg font-bold ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>{plan.plan_name}</Text>
                        <View className={`px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100' : 'bg-slate-200'}`}>
                            <Text className={`text-[10px] font-bold uppercase ${isActive ? 'text-green-700' : 'text-slate-500'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {plan.edu_type_name || 'Generic'}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className={`text-xl font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>₹{plan.price}</Text>
                    <Text className="text-xs text-slate-400 capitalize">{plan.duration?.toString().replace('_', ' ')}</Text>
                </View>
            </View>

            {/* Features List */}
            <View className="bg-slate-50 rounded-xl p-3 mb-4">
                {features.length > 0 ? (
                    features.map((feat, index) => (
                        <View key={index} className="flex-row items-center gap-2 mb-1 last:mb-0">
                            <CheckCircle size={12} color={isActive ? "#6366F1" : "#94A3B8"} />
                            <Text className={`text-xs flex-1 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{feat}</Text>
                        </View>
                    ))
                ) : (
                    <Text className="text-xs text-slate-400 italic">No specific features listed</Text>
                )}
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 pt-2 border-t border-slate-100">
                <AppButton
                    variant="custom"
                    fullWidth={false}
                    onPress={() => onEdit(plan)}
                    className="flex-1 bg-indigo-50 h-10"
                >
                    <View className="flex-row items-center justify-center">
                        <Edit2 size={16} color="#4F46E5" />
                        <Text className="ml-2 text-xs font-bold text-indigo-700">Edit</Text>
                    </View>
                </AppButton>

                <AppButton
                    variant="custom"
                    fullWidth={false}
                    onPress={() => onToggleStatus(plan)}
                    className={`flex-1 h-10 ${isActive ? 'bg-amber-50' : 'bg-emerald-50'}`}
                >
                    <View className="flex-row items-center justify-center">
                        <Power size={16} color={isActive ? '#D97706' : '#10B981'} />
                        <Text className={`ml-2 text-xs font-bold ${isActive ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {isActive ? 'Deactivate' : 'Activate'}
                        </Text>
                    </View>
                </AppButton>

                <AppButton
                    variant="custom"
                    fullWidth={false}
                    onPress={() => onDelete(plan.id)}
                    className="w-12 h-10 bg-red-50"
                >
                    <Trash2 size={16} color="#EF4444" />
                </AppButton>
            </View>
        </View>
    );
};

const PlansScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [plans, setPlans] = useState([]);
    const [eduTypes, setEduTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Tabs state
    const [activeTab, setActiveTab] = useState(null);

    // Fetch Edu Types on Mount
    useEffect(() => {
        const loadEduTypes = async () => {
            try {
                const response = await authService.getEduTypes();
                if (Array.isArray(response) && response.length > 0) {
                    setEduTypes(response);
                    setActiveTab(response[0].id);
                }
            } catch (error) {
                console.error('Failed to load edu types:', error);
                showToast('Failed to load education types', 'error');
            }
        };
        loadEduTypes();
    }, []);

    const fetchPlans = useCallback(async () => {
        if (!activeTab) return;

        try {
            setIsLoading(true);
            const data = await apiClient.get(`${API_ROUTES.ADMIN.SUBSCRIPTION.LIST}?edu_type_id=${activeTab}`);
            setPlans(Array.isArray(data) ? data : []);
        } catch (error) {
            showToast('Failed to fetch plans', 'error');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [showToast, activeTab]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPlans();
        });
        return unsubscribe;
    }, [navigation, fetchPlans]);

    useEffect(() => {
        fetchPlans();
    }, [activeTab]);

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Subscription Plan',
            'This action will permanently delete this plan from the system.\n\nThis record will be completely removed and cannot be recovered.\n\nAre you sure you want to continue?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiClient.delete(API_ROUTES.ADMIN.SUBSCRIPTION.DELETE(id));
                            showToast('Plan permanently deleted', 'success');
                            fetchPlans();
                        } catch (error) {
                            showToast('Failed to delete plan', 'error');
                        }
                    }
                }
            ]
        );
    };

    const handleToggleStatus = async (plan) => {
        try {
            await apiClient.patch(API_ROUTES.ADMIN.SUBSCRIPTION.STATUS(plan.id));
            showToast(`Plan ${plan.status === 1 ? 'deactivated' : 'activated'}`, 'success');
            fetchPlans();
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const activeLabel = eduTypes.find(t => t.id === activeTab)?.type_name || '';

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <AppHeader title="Subscription Plans" showBack={false} />

            {/* Horizontal Tabs */}
            <View className="bg-white pb-2">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
                >
                    {eduTypes.map((type) => (
                        <AppButton
                            key={type.id}
                            variant="custom"
                            fullWidth={false}
                            onPress={() => setActiveTab(type.id)}
                            className={`px-5 h-9 border ${activeTab === type.id
                                ? 'bg-indigo-800 border-indigo-800'
                                : 'bg-white border-indigo-800'
                                }`}
                        >
                            <Text className={`text-xs font-bold ${activeTab === type.id ? 'text-white' : 'text-slate-600'
                                }`}>
                                {type.type_name}
                            </Text>
                        </AppButton>
                    ))}
                </ScrollView>
            </View>

            <View className="px-5 py-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-slate-800">
                    {activeLabel ? `${activeLabel} Plans` : 'Loading...'}
                </Text>

                <AppButton
                    variant="primary"
                    fullWidth={false}
                    onPress={() => navigation.navigate('CreatePlan', {
                        edu_type_id: activeTab,
                        edu_type_label: activeLabel
                    })}
                    className="px-4 h-10 shadow-sm shadow-indigo-200"
                >
                    <View className="flex-row items-center">
                        <Plus size={18} color="white" className="mr-5" />
                        <Text className="text-white font-bold text-xs uppercase tracking-wide">New Plan</Text>
                    </View>
                </AppButton>
            </View>

            {isLoading && !refreshing ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-5"
                    contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPlans(); }} />
                    }
                >
                    {plans.length === 0 ? (
                        <View className="mt-10 items-center justify-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
                            <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <Plus size={32} color="#94A3B8" />
                            </View>
                            <Text className="text-slate-500 font-bold text-lg mb-1">No plans found</Text>
                            <Text className="text-slate-400 text-xs text-center px-10">
                                Create a new subscription plan for {activeLabel.toLowerCase()} to get started.
                            </Text>
                        </View>
                    ) : (
                        plans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onEdit={(p) => navigation.navigate('CreatePlan', { plan: p, edu_type_id: activeTab })}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default PlansScreen;
