import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Upload, Building2, Users, UserCheck, Calendar, Tag, Filter } from 'lucide-react-native';
import { schoolService } from '../../services';
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

const StatCard = ({ icon, label, value }) => (
    <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl flex-1 border border-gray-100">
        {icon}
        <View className="ml-3">
            <Text className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{label}</Text>
            <Text className="text-sm font-bold text-slate-800">{value}</Text>
        </View>
    </View>
);

const SchoolCard = ({ school }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <View className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center mr-4">
                    <Building2 size={24} color="#6366F1" />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900">{school.school_name}</Text>
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{school.school_code}</Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-600 text-[10px] font-black uppercase">Active</Text>
                </View>
            </View>

            <View className="flex-row gap-3">
                <StatCard icon={<Users size={16} color="#6366F1" />} label="Teachers" value={school.teacher_count} />
                <StatCard icon={<UserCheck size={16} color="#F59E0B" />} label="Avg Inc." value={school.admission_incharge_count} />
            </View>

            <View className="mt-6 pt-4 border-t border-gray-50 space-y-3">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Tag size={14} color="#6366F1" className="mr-2" />
                        <Text className="text-xs text-slate-500 font-bold uppercase tracking-tight">Plan</Text>
                    </View>
                    <Text className="text-xs font-black text-slate-800 uppercase">{school.plan_name || 'Free'}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Calendar size={14} color="#94A3B8" className="mr-2" />
                        <Text className="text-xs text-slate-500 font-bold uppercase tracking-tight">Expiry</Text>
                    </View>
                    <Text className={`text-xs font-black uppercase ${school.remaining_days > 15 ? 'text-slate-800' : 'text-red-500'}`}>
                        {formatDate(school.subscription_end_date)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const SchoolsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSchools = useCallback(async () => {
        try {
            const data = await schoolService.getAllSchools();
            setSchools(data);
        } catch (error) {
            showToast(error.message || 'Failed to fetch schools', 'error');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader useLogo={true} showBack={false} />

            <View className="px-5 py-4 flex-row items-center justify-between border-b border-gray-50 bg-white">
                <Text className="text-xl font-bold text-slate-800">Workspace Schools</Text>
                <View className="flex-row">
                    <HeaderIconButton icon={Plus} onPress={() => navigation.navigate('CreateSchool')} />
                    <HeaderIconButton icon={Upload} onPress={() => navigation.navigate('BulkImport')} />
                    <HeaderIconButton icon={Filter} onPress={() => navigation.navigate('FilterSchools')} />
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
                            onRefresh={() => { setRefreshing(true); fetchSchools(); }}
                            tintColor="#6366F1"
                        />
                    }
                >
                    {schools.length === 0 ? (
                        <View className="flex-1 items-center justify-center mt-20">
                            <Building2 size={64} color="#F1F5F9" />
                            <Text className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-xs">No schools found</Text>
                        </View>
                    ) : (
                        schools.map(school => <SchoolCard key={school.id} school={school} />)
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default SchoolsScreen;
