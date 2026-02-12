import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AppHeader = ({
    title,
    showBack = true,
    showNotification = true,
    useLogo = false,
}) => {
    const navigation = useNavigation();

    return (
        <View
            style={{
                height: 60,
                backgroundColor: '#3730A3', // indigo-800
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,

                // iOS shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
                shadowRadius: 4,

                // Android shadow
                elevation: Platform.OS === 'android' ? 6 : 0,
            }}
        >
            {/* LEFT SECTION */}
            <View className="flex-row items-center flex-1">
                {showBack && (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}
                    >
                        <ArrowLeft size={18} color="#fff" />
                    </TouchableOpacity>
                )}

                {useLogo ? (
                    <View className="flex-row items-center">
                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center',

                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0,
                                shadowRadius: 3,
                                elevation: Platform.OS === 'android' ? 3 : 0,
                            }}
                        >
                            <Image
                                source={require('../../../assets/logo.png')}
                                style={{ width: 22, height: 22 }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                ) : (
                    <Text
                        numberOfLines={1}
                        className="text-white font-bold text-lg tracking-tight"
                    >
                        {title}
                    </Text>
                )}
            </View>

            {/* RIGHT SECTION */}
            {showNotification ? (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Bell size={18} color="#fff" />

                    {/* Notification Dot */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 7,
                            right: 7,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#EF4444',
                        }}
                    />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 36 }} />
            )}
        </View>
    );
};

export default AppHeader;
