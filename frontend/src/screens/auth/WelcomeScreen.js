import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, ArrowRight } from 'lucide-react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1 items-center justify-center relative overflow-hidden" edges={['top', 'bottom']}>
                {/* Decorative Background Shapes - Optimized for Light Theme */}
                <View className="absolute top-20 -left-12 w-64 h-64 rounded-full bg-indigo-50" />
                <View className="absolute bottom-40 -right-8 w-72 h-72 rounded-full bg-emerald-50" />
                <View className="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-amber-50/50" />

                {/* Content Layer */}
                <View className="items-center px-10 z-10 w-full">
                    <View className="mb-10 p-4 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-100/50">
                        <Image
                            source={require('../../../assets/logo.png')}
                            className="w-16 h-16"
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tighter uppercase">
                        Nova Campus
                    </Text>

                    <Text className="text-base text-slate-500 text-center mb-20 font-bold uppercase tracking-[2px] leading-relaxed">
                        Seamless Institutional{'\n'}Management Ecosystem{'\n'}
                        <Text className="text-indigo-400">Advanced Enterprise Edition</Text>
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.9}
                        className="w-full bg-[#6366F1] rounded-[24px] py-5 flex-row justify-center items-center shadow-2xl shadow-indigo-200"
                    >
                        <Text className="text-white font-black text-base mr-3 uppercase tracking-widest">Inaugurate Workspace</Text>
                        <View className="bg-white/20 p-1 rounded-full">
                            <ArrowRight size={16} color="white" />
                        </View>
                    </TouchableOpacity>

                    <Text className="text-slate-300 text-[8px] font-black mt-16 uppercase tracking-[4px]">
                        Persistence Engine v1.0.110
                    </Text>
                </View>

                {/* Subtle Visual Accents */}
                <View className="absolute top-1/4 right-20 opacity-20">
                    <Sparkles size={32} color="#6366F1" />
                </View>
                <View className="absolute bottom-1/3 left-10 opacity-10">
                    <Sparkles size={20} color="#6366F1" />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default WelcomeScreen;
