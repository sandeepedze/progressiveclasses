import React from 'react';
import { View, Text } from 'react-native';
import AppCard from './AppCard';
import { colors } from '../../theme/colors';

const AppStatCard = ({ title, value, icon, trend, trendValue, color = 'indigo' }) => {
    return (
        <AppCard className="flex-1 min-w-[45%] mx-1">
            <View className="flex-row justify-between items-start mb-2">
                <View className={`p-2 rounded-xl bg-${color}-50`}>
                    {icon}
                </View>
                {trend && (
                    <View className={`flex-row items-center ${trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'} px-1.5 py-0.5 rounded-lg`}>
                        <Text className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-700' : 'text-red-700'}`}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </Text>
                    </View>
                )}
            </View>
            <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</Text>
            <Text className="text-2xl font-bold text-slate-800">{value}</Text>
        </AppCard>
    );
};

export default AppStatCard;
