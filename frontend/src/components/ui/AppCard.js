import React from 'react';
import { View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const AppCard = ({
    children,
    gradient = false,
    glass = false,
    className = "",
    style
}) => {
    // Base styles using Tailwind
    const baseClasses = `rounded-[24px] overflow-hidden ${className}`;

    if (gradient) {
        return (
            <LinearGradient
                colors={['#ffffff', '#f1f5f9']}
                className={`border border-slate-100 shadow-sm ${baseClasses}`}
                style={style}
            >
                <View className="p-5">{children}</View>
            </LinearGradient>
        );
    }

    if (glass) {
        return (
            <View
                style={style}
                className={`mb-4 ${baseClasses} border border-white/40 shadow-sm`}
            >
                <BlurView
                    intensity={Platform.OS === 'ios' ? 80 : 100}
                    tint="light"
                    className="absolute inset-0"
                />
                <View className="p-5 bg-white/60">
                    {children}
                </View>
            </View>
        );
    }

    return (
        <View
            style={style}
            className={`bg-white border border-slate-100 p-5 mb-4 shadow-sm ${baseClasses}`}
        >
            {children}
        </View>
    );
};

export default AppCard;
