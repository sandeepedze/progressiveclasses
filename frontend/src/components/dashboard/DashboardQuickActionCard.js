import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const DashboardQuickActionCard = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-white p-5 rounded-[24px] mb-4 shadow-sm border border-slate-50"
        >
            <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4 bg-indigo-50">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-base font-bold text-slate-800">{title}</Text>
            </View>
            <View className="bg-indigo-50 p-1 rounded-full">
                <ChevronRight size={16} color="#6366F1" />
            </View>
        </TouchableOpacity>
    );
};

export default DashboardQuickActionCard;
