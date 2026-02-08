import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/layout/AppHeader';
import { useSelector } from 'react-redux';
import { School, CreditCard, DollarSign, Activity, Plus } from 'lucide-react-native';
import DashboardStatCard from '../../components/dashboard/DashboardStatCard';
import DashboardQuickActionCard from '../../components/dashboard/DashboardQuickActionCard';
import AppCard from '../../components/ui/AppCard';

// Mock Data for Super Admin (Standardized colors)
const SUPER_ADMIN_STATS = [
    { id: 1, title: 'Schools Count', value: '24', icon: <School size={22} color="#6366F1" />, subtext: '+2 this month' },
    { id: 2, title: 'Revenue', value: '₹4.5L', icon: <DollarSign size={22} color="#10B981" />, subtext: 'Total collected' },
    { id: 3, title: 'Active Subs', value: '18', icon: <Activity size={22} color="#F59E0B" />, subtext: 'Gold & Platinum' },
];

const RECENT_ACTIVITY = [
    { id: 1, school: 'Greenwood High', action: 'Subscribed to Gold Plan', time: '2 mins ago', icon: 'S' },
    { id: 2, school: 'St. Marys School', action: 'Added 50 new students', time: '1 hour ago', icon: 'M' },
    { id: 3, school: 'Global Tech Academy', action: 'Ticket: Login Issue', time: '3 hours ago', icon: 'G' },
];

const MODULE_ACCESS = [
    { id: 1, name: 'Student Mgmt', enabled: true },
    { id: 2, name: 'HR & Payroll', enabled: true },
    { id: 3, name: 'Transport', enabled: false },
    { id: 4, name: 'Library', enabled: true },
];

const SuperAdminDashboard = ({ navigation }) => {
    const { user } = useSelector(state => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader useLogo={true} showBack={false} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#6366F1"
                    />
                }
            >
                {/* Stats Row */}
                <Text className="text-slate-800 font-bold text-sm uppercase tracking-widest mb-4">Core Overview</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-1">
                    {SUPER_ADMIN_STATS.map(stat => (
                        <DashboardStatCard key={stat.id} {...stat} />
                    ))}
                </ScrollView>

                {/* Quick Actions */}
                <Text className="text-slate-800 font-bold text-sm uppercase tracking-widest mb-4">Quick Actions</Text>
                <View className="mb-8">
                    <DashboardQuickActionCard
                        title="Register New School"
                        icon={<Plus size={22} color="#6366F1" />}
                        onPress={() => navigation.navigate('CreateSchool')}
                    />
                    <DashboardQuickActionCard
                        title="Create Subscription Plan"
                        icon={<CreditCard size={22} color="#6366F1" />}
                        onPress={() => navigation.navigate('CreatePlan')}
                    />
                </View>

                {/* System Health & Modules */}
                <Text className="text-slate-800 font-bold text-sm uppercase tracking-widest mb-4">System Health & Modules</Text>
                <View className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 mb-8">
                    <View className="flex-row flex-wrap justify-between">
                        {MODULE_ACCESS.map(module => (
                            <View key={module.id} className="flex-row items-center w-[48%] mb-4">
                                <View className={`w-2.5 h-2.5 rounded-full mr-3 ${module.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <Text className={`text-xs font-bold ${module.enabled ? 'text-slate-700' : 'text-slate-400'} uppercase tracking-tighter`}>
                                    {module.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-slate-800 font-bold text-sm uppercase tracking-widest">Recent Activity</Text>
                    <Text className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">View All</Text>
                </View>

                {RECENT_ACTIVITY.map(item => (
                    <AppCard key={item.id} className="flex-row items-center p-4 mb-3">
                        <View className="h-12 w-12 rounded-2xl bg-indigo-50 items-center justify-center mr-4">
                            <Text className="font-black text-indigo-600 text-lg">{item.icon}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-slate-800 text-base">{item.school}</Text>
                            <Text className="text-slate-500 text-xs font-medium mt-1">{item.action}</Text>
                        </View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase">{item.time}</Text>
                    </AppCard>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

export default SuperAdminDashboard;
