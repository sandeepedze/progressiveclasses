import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Package, CheckCircle, CreditCard, ChevronRight, Filter } from 'lucide-react-native';
import { subscriptionService } from '../../services';
import { useToast } from '../../context/ToastContext';
import AppHeader from '../../components/layout/AppHeader';

const HeaderIconButton = ({ icon: Icon, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center ml-2 border border-indigo-100"
    >
        <Icon size={18} color="#6366F1" />
    </TouchableOpacity>
);

const PlanCard = ({ plan }) => {
    const benefits = plan.benefits ? plan.benefits.split(', ') : [];

    return (
        <View className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm mb-5">
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center mr-4">
                        <Package size={24} color="#6366F1" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-slate-900">{plan.plan_name}</Text>
                        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                            {plan.duration_months} Months Term
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-2xl font-black text-indigo-600 italic">₹{plan.price_monthly}</Text>
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ Month</Text>
                </View>
            </View>

            <View className="bg-gray-50 p-5 rounded-[24px] border border-gray-100">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Plan Features</Text>
                <View className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <View key={index} className="flex-row items-center">
                            <CheckCircle size={14} color="#10B981" className="mr-3" />
                            <Text className="text-sm text-slate-700 font-bold uppercase tracking-tighter">{benefit}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-center mt-6 py-3 bg-indigo-50 rounded-2xl">
                <Text className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mr-2">View Full Specification</Text>
                <ChevronRight size={14} color="#6366F1" />
            </TouchableOpacity>
        </View>
    );
};

const PlansScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPlans = useCallback(async () => {
        try {
            const data = await subscriptionService.getAllPlans();
            setPlans(data);
        } catch (error) {
            showToast(error.message || 'Failed to fetch plans', 'error');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader useLogo={true} showBack={false} />

            <View className="px-5 py-4 flex-row items-center justify-between border-b border-gray-50 bg-white">
                <Text className="text-xl font-bold text-slate-800">Workspace Plans</Text>
                <View className="flex-row">
                    <HeaderIconButton icon={Plus} onPress={() => navigation.navigate('CreatePlan')} />
                    <HeaderIconButton icon={Filter} onPress={() => navigation.navigate('FilterPlans')} />
                </View>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        padding: 24,
                        paddingBottom: insets.bottom + 40
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); fetchPlans(); }}
                            tintColor="#6366F1"
                        />
                    }
                >
                    {plans.length === 0 ? (
                        <View className="flex-1 items-center justify-center mt-20">
                            <CreditCard size={64} color="#F1F5F9" />
                            <Text className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-xs">No plans defined yet</Text>
                        </View>
                    ) : (
                        plans.map(plan => <PlanCard key={plan.id} plan={plan} />)
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default PlansScreen;
