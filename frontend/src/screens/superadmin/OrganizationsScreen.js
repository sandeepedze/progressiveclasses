import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Filter, Phone, Mail, MapPin, Building2, BookOpen, GraduationCap, Library } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import AppHeader from '../../components/layout/AppHeader';
import apiClient from '../../services/apiClient';
import { API_ROUTES } from '../../constants/apiRoutes';

const ICON_MAP = {
    'Schools': <GraduationCap size={20} color="#6366F1" />,
    'Institutes': <Building2 size={20} color="#F59E0B" />,
    'Coaching': <BookOpen size={20} color="#10B981" />,
    'Tuition': <Library size={20} color="#EC4899" />,
};

const OrganizationCard = ({ org }) => (
    <View className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm mb-4">
        <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
                    {ICON_MAP[org.type] || <Building2 size={20} color="#64748B" />}
                </View>
                <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900" numberOfLines={1}>{org.organization_name}</Text>
                    <Text className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mt-0.5">
                        {org.type}
                    </Text>
                </View>
            </View>
            <View className={`px-2 py-1 rounded-full ${org.status === 'Active' ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text className={`text-[10px] font-bold uppercase ${org.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>
                    {org.status}
                </Text>
            </View>
        </View>

        <View className="space-y-2">
            <View className="flex-row items-center">
                <Mail size={14} color="#94A3B8" className="mr-2" />
                <Text className="text-xs text-slate-600 font-medium">{org.email}</Text>
            </View>
            <View className="flex-row items-center">
                <Phone size={14} color="#94A3B8" className="mr-2" />
                <Text className="text-xs text-slate-600 font-medium">{org.mobile}</Text>
            </View>
            <View className="flex-row items-center pt-2 mt-2 border-t border-gray-50">
                <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Created: {new Date(org.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    </View>
);

const OrganizationsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrganizations = useCallback(async () => {
        try {
            const data = await apiClient.get(API_ROUTES.ADMIN.ORGANIZATION.LIST);
            setOrganizations(Array.isArray(data) ? data : []);
        } catch (error) {
            showToast('Failed to fetch organizations', 'error');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [showToast]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchOrganizations();
        });
        return unsubscribe;
    }, [navigation, fetchOrganizations]);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader title="Organizations" showBack={false} />

            <View className="px-5 py-4 flex-row items-center justify-between border-b border-gray-50">
                <Text className="text-lg font-bold text-slate-800">All Organizations</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddOrganization')}
                    className="bg-indigo-600 px-4 py-2 rounded-xl flex-row items-center"
                >
                    <Plus size={16} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-xs uppercase">New Org</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1 bg-gray-50"
                    contentContainerStyle={{
                        padding: 20,
                        paddingBottom: insets.bottom + 40
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrganizations(); }} />
                    }
                >
                    {organizations.length === 0 ? (
                        <View className="items-center mt-20">
                            <Building2 size={48} color="#CBD5E1" />
                            <Text className="text-slate-400 font-bold mt-4">No organizations found</Text>
                        </View>
                    ) : (
                        organizations.map(org => <OrganizationCard key={org.id} org={org} />)
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default OrganizationsScreen;
