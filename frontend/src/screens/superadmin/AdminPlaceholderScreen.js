import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/layout/AppHeader';
import { Building2, BookOpen, Library } from 'lucide-react-native';

const ICON_MAP = {
    'Institutes': <Building2 size={64} color="#F59E0B" />,
    'Coaching': <BookOpen size={64} color="#10B981" />,
    'Tuition': <Library size={64} color="#EC4899" />,
};

const AdminPlaceholderScreen = ({ route }) => {
    const { title = 'Module' } = route.params || {};

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <AppHeader title={title} showBack={false} />

            <View className="flex-1 items-center justify-center p-6">
                <View className="w-32 h-32 bg-gray-50 rounded-full items-center justify-center mb-6">
                    {ICON_MAP[title] || <Building2 size={64} color="#94A3B8" />}
                </View>

                <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
                    {title} Management
                </Text>

                <Text className="text-slate-500 text-center font-medium leading-relaxed">
                    This module is currently under development. You will be able to manage {title.toLowerCase()} here soon.
                </Text>

                <View className="mt-8 bg-indigo-50 px-4 py-2 rounded-full">
                    <Text className="text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        Coming Soon
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AdminPlaceholderScreen;
