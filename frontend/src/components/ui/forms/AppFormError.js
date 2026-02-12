import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const AppFormError = ({ error }) => {
    if (!error) return null;
    return (
        <View className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 flex-row items-center">
            <Text className="text-red-600 text-sm flex-1">{error}</Text>
        </View>
    );
};
