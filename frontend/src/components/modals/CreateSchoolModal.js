import React from 'react';
import { View } from 'react-native';
import AppInput from '../ui/AppInput';

const CreateSchoolForm = ({ form, handleChange }) => {
    return (
        <View className="space-y-1">
            <AppInput
                label="School Name"
                placeholder="e.g. Springfield High"
                value={form.school_name}
                onChangeText={(t) => handleChange('school_name', t)}
            />
            <View className="flex-row justify-between">
                <View className="w-[48%]">
                    <AppInput
                        label="School Code"
                        placeholder="SF001"
                        value={form.school_code}
                        onChangeText={(t) => handleChange('school_code', t)}
                    />
                </View>
                <View className="w-[48%]">
                    <AppInput
                        label="Official Phone"
                        placeholder="+91..."
                        value={form.phone}
                        onChangeText={(t) => handleChange('phone', t)}
                    />
                </View>
            </View>
            <AppInput
                label="Official Email"
                placeholder="contact@school.com"
                value={form.email}
                onChangeText={(t) => handleChange('email', t)}
            />
            <AppInput
                label="Admin Name"
                placeholder="Principal Name"
                value={form.admin_name}
                onChangeText={(t) => handleChange('admin_name', t)}
            />
            <AppInput
                label="Admin Email"
                placeholder="admin@school.com"
                value={form.admin_email}
                onChangeText={(t) => handleChange('admin_email', t)}
            />
            <AppInput
                label="Admin Password"
                placeholder="••••••••"
                value={form.admin_password}
                onChangeText={(t) => handleChange('admin_password', t)}
                secureTextEntry
                passwordToggle={true}
            />
        </View>
    );
};

export default CreateSchoolForm;
