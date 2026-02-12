import React from 'react';
import { View } from 'react-native';
import AppInput from '../ui/AppInput';

const CreatePlanForm = ({ form, handleChange }) => {
    return (
        <View className="space-y-1">
            <AppInput
                label="Subscription Plan Name"
                placeholder="e.g. Platinum Plus"
                value={form.plan_name}
                onChangeText={(t) => handleChange('plan_name', t)}
            />
            <View className="flex-row justify-between">
                <View className="w-[48%]">
                    <AppInput
                        label="Monthly Fee (₹)"
                        placeholder="0.00"
                        value={form.price_monthly}
                        onChangeText={(t) => handleChange('price_monthly', t)}
                        keyboardType="numeric"
                    />
                </View>
                <View className="w-[48%]">
                    <AppInput
                        label="Term (Months)"
                        placeholder="12"
                        value={form.duration_months}
                        onChangeText={(t) => handleChange('duration_months', t)}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <AppInput
                label="Teacher Allocation"
                placeholder="e.g. 100"
                value={form.max_teachers}
                onChangeText={(t) => handleChange('max_teachers', t)}
                keyboardType="numeric"
            />
            <AppInput
                label="Core Benefits"
                placeholder="List benefits separated by commas..."
                value={form.benefits}
                onChangeText={(t) => handleChange('benefits', t)}
                multiline={true}
            />
        </View>
    );
};

export default CreatePlanForm;
