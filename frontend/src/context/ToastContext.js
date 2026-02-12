import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { CircleCheck, CircleAlert, Info, XCircle } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../features/ui/uiSlice';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const TOAST_VARIANTS = {
    success: {
        icon: CircleCheck,
        color: '#10B981', // emerald-500
        bgColor: '#ECFDF5', // emerald-50
    },
    error: {
        icon: CircleAlert,
        color: '#EF4444', // red-500
        bgColor: '#FEF2F2', // red-50
    },
    info: {
        icon: Info,
        color: '#3B82F6', // blue-500
        bgColor: '#EFF6FF', // blue-50
    },
    warning: {
        icon: XCircle,
        color: '#F59E0B', // amber-500
        bgColor: '#FFFBEB', // amber-50
    }
};

export const ToastProvider = ({ children }) => {
    const reduxDispatch = useDispatch();
    const reduxToasts = useSelector(state => state.ui.toasts);

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('info');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(20)); // Start 20px down

    const showToast = useCallback((msg, type = 'info') => {
        setMessage(msg);
        setVariant(type);
        setVisible(true);

        // Animate In
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        // Auto Hide after 3 seconds
        setTimeout(hideToast, 3000);
    }, [fadeAnim, slideAnim]);

    // Bridge Redux Toasts to this Provider
    useEffect(() => {
        if (reduxToasts.length > 0) {
            const lastToast = reduxToasts[reduxToasts.length - 1];
            showToast(lastToast.message, lastToast.type);
            reduxDispatch(removeToast(lastToast.id));
        }
    }, [reduxToasts, showToast, reduxDispatch]);

    const hideToast = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 20,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => setVisible(false));
    }, [fadeAnim, slideAnim]);

    const activeVariant = TOAST_VARIANTS[variant] || TOAST_VARIANTS.info;
    const Icon = activeVariant.icon;

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {visible && (
                <View style={styles.container} pointerEvents="none">
                    <Animated.View
                        style={[
                            styles.toast,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 8,
                            }
                        ]}
                    >
                        {/* Icon Box */}
                        <View style={[styles.iconContainer, { backgroundColor: activeVariant.color }]}>
                            <Icon size={16} color="white" strokeWidth={3} />
                        </View>

                        {/* Text */}
                        <Text style={styles.text}>{message}</Text>
                    </Animated.View>
                </View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, // Positioned above the tab bar
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 9999, // Full pill shape
        paddingVertical: 10,
        paddingHorizontal: 16,
        minWidth: 180,
        maxWidth: '90%',
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 6, // Slightly rounded square like in the image
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937', // gray-800
    }
});
