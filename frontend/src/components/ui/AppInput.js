import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const AppInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    icon,
    keyboardType = 'default',
    multiline = false,
    passwordToggle = false
}) => {
    const [visible, setVisible] = useState(false);
    const isSecure = passwordToggle ? (secureTextEntry && !visible) : secureTextEntry;

    return (
        <View className="mb-5 w-full">
            {label && (
                <Text className="text-gray-500 font-bold mb-2 ml-1 uppercase text-[10px] tracking-widest">
                    {label}
                </Text>
            )}

            <View
                className={`flex-row items-center bg-gray-50 rounded-md px-4 ${multiline ? 'min-h-[100px] py-3' : 'h-14'} ${error ? 'border border-red-400' : 'border border-gray-300'
                    }`}
            >
                {/* Icons allowed ONLY in login screen - handled by the caller passing the icon prop */}
                {icon && <View className="mr-3">{icon}</View>}

                <TextInput
                    className="flex-1 text-slate-800 text-base"
                    style={{ height: '100%' }}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={isSecure}
                    placeholderTextColor="#94A3B8"
                    keyboardType={keyboardType}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                />

                {passwordToggle && (
                    <TouchableOpacity onPress={() => setVisible(!visible)} className="ml-2 p-1">
                        {visible ? (
                            <EyeOff size={18} color="#94A3B8" />
                        ) : (
                            <Eye size={18} color="#94A3B8" />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{error}</Text>}
        </View>
    );
};

export default AppInput;
