import React, { useEffect } from 'react';
import { View, Text, Modal, ActivityIndicator, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../../features/ui/uiSlice';
import { CheckCircle, AlertCircle, X } from 'lucide-react-native';

const ToastItem = ({ id, message, type }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(id));
        }, 3000);
        return () => clearTimeout(timer);
    }, [id, dispatch]);

    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
    const icon = type === 'success' ? <CheckCircle color="white" size={20} /> : <AlertCircle color="white" size={20} />;

    return (
        <Animated.View className={`mx-4 mb-3 p-4 rounded-xl flex-row items-center shadow-lg ${bgColor}`}>
            {icon}
            <Text className="flex-1 text-white font-medium ml-3">{message}</Text>
        </Animated.View>
    );
};

export const GlobalToastOverlay = () => {
    const toasts = useSelector(state => state.ui.toasts);

    if (!toasts || toasts.length === 0) return null;

    return (
        <View className="absolute top-12 left-0 right-0 z-50">
            {toasts.map(toast => (
                <ToastItem key={toast.id} {...toast} />
            ))}
        </View>
    );
};

export const LoadingOverlay = ({ visible, message = 'Loading...' }) => {
    if (!visible) return null;
    return (
        <Modal transparent animationType="fade">
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className="bg-white p-6 rounded-2xl items-center shadow-xl">
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text className="mt-4 text-slate-700 font-bold">{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

export const ScreenWrapper = ({ children, loading, scrollable = false }) => {
    return (
        <View className="flex-1 bg-slate-50">
            {children}
            <LoadingOverlay visible={loading} />
            <GlobalToastOverlay />
        </View>
    );
};
