import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const DashboardQuickActionCard = ({ title, icon, color, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 active:bg-slate-50"
        >
            <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${color}15` }}
            >
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-slate-800 font-bold text-base">{title}</Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
                <ChevronRight size={16} color="#94A3B8" />
            </View>
        </TouchableOpacity>
    );
};

export default DashboardQuickActionCard;
