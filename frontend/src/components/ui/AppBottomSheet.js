import React, { useEffect, useCallback } from 'react';
import { View, Modal, TouchableOpacity, Text, Dimensions, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SIZE_VARIANTS = {
    small: SCREEN_HEIGHT * 0.4,
    medium: SCREEN_HEIGHT * 0.6,
    full: SCREEN_HEIGHT * 0.9,
};

const AppBottomSheet = ({
    visible,
    onClose,
    title,
    children,
    size = 'medium',
    footer, // New prop for fixed button section
}) => {
    const insets = useSafeAreaInsets();
    const sheetHeight = SIZE_VARIANTS[size] || SIZE_VARIANTS.medium;

    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const closeSheet = useCallback(() => {
        translateY.value = withTiming(SCREEN_HEIGHT, {
            duration: 300,
            easing: Easing.out(Easing.cubic)
        }, (finished) => {
            if (finished) {
                runOnJS(onClose)();
            }
        });
        opacity.value = withTiming(0, {
            duration: 250,
            easing: Easing.out(Easing.cubic)
        });
    }, [onClose]);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(0.4, {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
            translateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
        }
    }, [visible]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const nextValue = context.value.y + event.translationY;
            translateY.value = Math.max(0, nextValue);
        })
        .onEnd((event) => {
            const threshold = sheetHeight * 0.3;
            if (event.translationY > threshold || event.velocityY > 500) {
                runOnJS(closeSheet)();
            } else {
                translateY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.out(Easing.cubic)
                });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={closeSheet}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop */}
                <Animated.View
                    style={backdropStyle}
                    className="absolute inset-0 bg-black"
                >
                    <TouchableOpacity
                        className="flex-1"
                        activeOpacity={1}
                        onPress={closeSheet}
                    />
                </Animated.View>

                {/* Keyboard Avoiding Wrapper */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="w-full"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <GestureDetector gesture={panGesture}>
                        <Animated.View
                            style={[
                                { height: sheetHeight },
                                animatedStyle
                            ]}
                            className="bg-white rounded-t-[32px] w-full shadow-2xl overflow-hidden"
                        >
                            {/* Drag Handle Indicator */}
                            <View className="items-center py-4">
                                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                            </View>

                            {/* Header */}
                            {title && (
                                <View className="flex-row items-center justify-between px-6 pb-4 border-b border-gray-50">
                                    <Text className="text-lg font-bold text-gray-800">
                                        {title}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={closeSheet}
                                        className="bg-gray-100 px-3 py-1.5 rounded-full"
                                    >
                                        <Text className="text-xs font-bold text-gray-500">Close</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Content Body with ScrollView */}
                            <ScrollView
                                className="flex-1 px-6 pt-4"
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{
                                    paddingBottom: (footer ? 100 : 40) + insets.bottom
                                }}
                            >
                                {children}
                            </ScrollView>

                            {/* Fixed Footer Section */}
                            {footer && (
                                <View
                                    className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-50 p-6"
                                    style={{ paddingBottom: Math.max(20, insets.bottom) }}
                                >
                                    {footer}
                                </View>
                            )}
                        </Animated.View>
                    </GestureDetector>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default AppBottomSheet;
