import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, ArrowRight } from "lucide-react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        className="flex-1 items-center justify-center relative overflow-hidden"
        edges={["top", "bottom"]}
      >
        {/* Decorative Background Shapes - Optimized for Light Theme */}
        <View className="absolute top-20 -left-12 w-64 h-64 rounded-full bg-indigo-100" />
        <View className="absolute bottom-40 -right-8 w-72 h-72 rounded-full bg-emerald-100" />
        <View className="absolute -bottom-0 right-10 w-32 h-32 rounded-full bg-amber-100" />

        {/* Content Layer */}
        <View className="items-center px-10 z-10 w-full">
          <View className="mb-10 p-4 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-100/50">
            <Image
              source={require("../../../assets/logo.png")}
              className="h-20 w-20"
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-bold text-center uppercase tracking-tighter">
            <Text className="text-4xl text-indigo-800">N</Text>ova{" "}
            <Text className="text-4xl text-indigo-800">C</Text>ampus
          </Text>

          

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.9}
            className="w-full bg-[#6366F1] rounded-[24px] py-5 flex-row justify-center items-center shadow-2xl shadow-indigo-200"
          >
            <Text className="text-white font-black text-base mr-3 uppercase tracking-widest">
              Inaugurate Workspace
            </Text>
            <View className="bg-white/20 p-1 rounded-full">
              <ArrowRight size={16} color="white" />
            </View>
          </TouchableOpacity>

          <Text className="text-slate-300 text-[8px] font-black mt-16 uppercase tracking-[4px]">
            Persistence Engine v1.0.110
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
