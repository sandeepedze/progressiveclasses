import React from 'react';
import { View, Text } from 'react-native';
import AppCard from '../ui/AppCard';

const DashboardStatCard = ({ title, value, icon, subtext }) => {
    return (
        <View className="w-44 mr-3">
            <AppCard className="p-5 h-full justify-between">
                <View className="flex-row justify-between items-start mb-4">
                    <View className="p-2.5 rounded-2xl bg-indigo-50">
                        {icon}
                    </View>
                    <Text className="text-2xl font-black text-slate-900 italic">{value}</Text>
                </View>
                <View>
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                        {title}
                    </Text>
                    {subtext && (
                        <Text className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">
                            {subtext}
                        </Text>
                    )}
                </View>
            </AppCard>
        </View>
    );
};

export default DashboardStatCard;
