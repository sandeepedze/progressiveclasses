import React from 'react';
import { View, Text } from 'react-native';

const AppBadge = ({
    text,
    variant = 'neutral', // success, warning, danger, primary, neutral, premium
    size = 'md'
}) => {

    let bgClass = 'bg-slate-100';
    let textClass = 'text-slate-600';

    switch (variant) {
        case 'success':
            bgClass = 'bg-emerald-100';
            textClass = 'text-emerald-700';
            break;
        case 'warning':
            bgClass = 'bg-amber-100';
            textClass = 'text-amber-700';
            break;
        case 'danger':
            bgClass = 'bg-red-100';
            textClass = 'text-red-700';
            break;
        case 'primary':
            bgClass = 'bg-indigo-100';
            textClass = 'text-indigo-700';
            break;
        case 'premium':
            bgClass = 'bg-purple-100';
            textClass = 'text-purple-700';
            break;
        default:
            bgClass = 'bg-slate-100';
            textClass = 'text-slate-600';
    }

    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

    return (
        <View className={`${bgClass} rounded-full ${sizeClass} self-start`}>
            <Text className={`${textClass} font-bold uppercase tracking-wider`}>{text}</Text>
        </View>
    );
};

export default AppBadge;
