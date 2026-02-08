import React from 'react';
import { View, Text } from 'react-native';

const DashboardStatCard = ({ title, value, icon, color, subtext }) => {
    return (
        <View className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-w-[150px] mr-3">
            <View className="flex-row justify-between items-start mb-2">
                <View className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
                    {icon}
                </View>
                {/* Optional trend indicator could go here */}
            </View>
            <Text className="text-2xl font-bold text-slate-800 mb-1">{value}</Text>
            <Text className="text-slate-500 text-sm font-medium">{title}</Text>
            {subtext && <Text className="text-slate-400 text-xs mt-1">{subtext}</Text>}
        </View>
    );
};

export default DashboardStatCard;
