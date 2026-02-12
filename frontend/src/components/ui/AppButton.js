import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';

const AppButton = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = true,
    className = "",
    children
}) => {
    // Base Classes
    // If fullWidth is true, apply w-full.
    // Default base: centered content, rounded corners.
    // Height: handled by className check or default h-10.
    const baseClasses = `items-center justify-center rounded-md overflow-hidden ${fullWidth ? 'w-full' : ''}`;
    const heightClass = className.includes('h-') ? "" : "h-10";
    const disabledClasses = (disabled || loading) ? "opacity-50" : "";

    // Helper to render content
    const renderContent = (textColor) => {
        if (loading) return <ActivityIndicator color={textColor} size="small" />;
        if (children) return children;
        return <Text className={`${textColor} font-bold text-base uppercase tracking-widest`}>{title}</Text>;
    };

    // Color/Variant config
    // Primary: Indigo-600 bg, White text
    // Outline: Transparent bg, Indigo-600 border, Indigo-600 text
    // Custom: Use className provided (ghost, secondary, dangerous, etc.)

    let containerClasses = "";
    let itemColor = "";

    if (variant === 'primary') {
        containerClasses = `bg-indigo-800 shadow-sm shadow-indigo-200`;
        itemColor = "#FFFFFF"; // For ActivityIndicator
    } else if (variant === 'outline') {
        containerClasses = `border border-indigo-600`;
        itemColor = "#4F46E5";
    } else {
        // Custom / Ghost
        // default to slate-100 if no bg is provided in className to ensure visibility if needed? 
        // User asked "Do NOT change colors". 
        // Existing logic: `!className.includes('bg-') ? 'bg-slate-100' : ''`
        containerClasses = !className.includes('bg-') && !className.includes('border') ? 'bg-slate-100' : '';
        itemColor = "#475569"; // slate-600
    }

    return (
        <View className={`${baseClasses} ${heightClass} ${containerClasses} ${disabledClasses} ${className}`}>
            <Pressable
                onPress={onPress}
                disabled={disabled || loading}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                style={({ pressed }) => [
                    {
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? (variant === 'primary' ? 0.9 : 0.6) : 1
                    }
                ]}
            >
                {renderContent(variant === 'primary' ? "text-white" : (variant === 'outline' ? "text-indigo-600" : "text-slate-600"))}
            </Pressable>
        </View>
    );
};

export default AppButton;
