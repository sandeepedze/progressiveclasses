import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const SettingsMenuItem = ({ icon, label, onPress, value, showChevron = true, isDestructive = false }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between p-4 bg-white border-b border-slate-50 active:bg-slate-50"
        >
            <View className="flex-row items-center flex-1">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDestructive ? 'bg-red-50' : 'bg-slate-50'}`}>
                    {icon}
                </View>
                <Text className={`text-base font-medium ${isDestructive ? 'text-red-600' : 'text-slate-700'}`}>
                    {label}
                </Text>
            </View>
            
            <View className="flex-row items-center">
                {value && <Text className="text-slate-400 mr-2">{value}</Text>}
                {showChevron && <ChevronRight size={20} color="#CBD5E1" />}
            </View>
        </TouchableOpacity>
    );
};

export default SettingsMenuItem;
