import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../../components/layout/AppHeader';
import AppButton from '../../components/ui/AppButton';
import FilterForm from '../../components/modals/FilterModal';
import { ScreenWrapper } from '../../components/ui/system/SystemComponents';

const FilterPlansScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [filters, setFilters] = useState({
        search: '',
        dateFrom: '',
        dateTo: '',
        location: ''
    });

    const handleApply = () => {
        navigation.goBack();
    };

    const handleReset = () => {
        setFilters({ search: '', dateFrom: '', dateTo: '', location: '' });
    };

    return (
        <ScreenWrapper>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <AppHeader title="Analyze Pricing" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >
                    <ScrollView
                        className="flex-1 px-5"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingTop: 24, paddingBottom: insets.bottom + 40 }}
                    >
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">Plan Configuration Filters</Text>

                        <FilterForm filters={filters} setFilters={setFilters} />

                        <View className="mt-12 space-y-3">
                            <AppButton
                                title="Execute Analysis"
                                onPress={handleApply}
                            />
                            <AppButton
                                title="Clear Constraints"
                                variant="ghost"
                                onPress={handleReset}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

export default FilterPlansScreen;
