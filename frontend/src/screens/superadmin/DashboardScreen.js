import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/layout/AppHeader';

const DashboardScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header (App name + Super Admin) */}
            <AppHeader title="Super Admin" showBack={false} showNotification={true} />

            {/* Blank Dashboard Content */}
            <View className="flex-1 items-center justify-center p-6">
                <Text className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Dashboard is currently empty
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default DashboardScreen;
