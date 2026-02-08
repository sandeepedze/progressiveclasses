import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const AppButton = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = ""
}) => {

    const baseClasses = "w-full h-14 items-center justify-center rounded-md";
    const disabledClasses = (disabled || loading) ? "opacity-50" : "";

    // Primary Button (Indigo/Brand)
    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled || loading}
                className={`${baseClasses} bg-indigo-800 shadow-lg shadow-indigo-200 ${disabledClasses} ${className}`}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text className="text-white font-bold text-base uppercase tracking-widest">{title}</Text>
                )}
            </TouchableOpacity>
        );
    }

    // Outline Button
    if (variant === 'outline') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                disabled={disabled || loading}
                className={`${baseClasses} border-[1px] border-indigo-700 ${disabledClasses} ${className}`}
            >
                {loading ? (
                    <ActivityIndicator color="#6366F1" size="small" />
                ) : (
                    <Text className="text-indigo-700 font-bold text-base uppercase tracking-widest">{title}</Text>
                )}
            </TouchableOpacity>
        );
    }

    // Ghost/Secondary (Neutral)
    if (variant === 'ghost' || variant === 'secondary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.6}
                disabled={disabled || loading}
                className={`${baseClasses} bg-gray-100 ${disabledClasses} ${className}`}
            >
                {loading ? (
                    <ActivityIndicator color="#64748b" size="small" />
                ) : (
                    <Text className="text-gray-600 font-bold text-base uppercase tracking-widest">{title}</Text>
                )}
            </TouchableOpacity>
        );
    }

    return null;
};

export default AppButton;
