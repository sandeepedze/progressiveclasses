import React, { useState } from 'react';
import { View, Text, useWindowDimensions, Image, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Bell, Calendar, ChevronRight } from 'lucide-react-native';

// --- Atomic Components for Dashboard ---

const FeatureCard = () => (
    <View className="bg-emerald-50 rounded-3xl p-5 mb-6 flex-row items-center border border-emerald-100 shadow-sm">
        <View className="flex-1">
            <View className="bg-white self-start px-2 py-1 rounded-full mb-2">
                <Text className="text-emerald-700 text-xs font-bold uppercase">Live Class</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-1">Creative Sketching</Text>
            <Text className="text-gray-500 text-sm mb-3">Today, 10:00 AM</Text>

            {/* Progress Bar */}
            <View className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <View className="h-full w-2/3 bg-black rounded-full" />
            </View>
        </View>
        <View className="bg-white w-14 h-14 rounded-full items-center justify-center ml-4 shadow-sm">
            {/* Play Icon Placeholder */}
            <View className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-black border-b-8 border-b-transparent ml-1" />
        </View>
    </View>
);

const LessonRow = ({ title, time, date, duration, iconColor = "bg-blue-100" }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm border border-gray-50">
        <View className={`w-12 h-12 rounded-full ${iconColor} items-center justify-center mr-4`}>
            <Text className="text-lg font-bold">Aa</Text>
        </View>
        <View className="flex-1">
            <Text className="text-base font-bold text-gray-900">{title}</Text>
            <Text className="text-sm text-gray-500">{time}</Text>
        </View>
        <View className="items-end">
            <Text className="text-sm font-bold text-gray-900">{date}</Text>
            <Text className="text-xs text-gray-400">{duration}</Text>
        </View>
    </View>
);

// --- Tab Routes ---

const OverviewRoute = () => (
    <ScrollView className="flex-1 bg-offWhite p-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">Today's Scheduler</Text>
        <FeatureCard />

        <View className="flex-row justify-between items-center mb-4 mt-2">
            <Text className="text-lg font-bold text-gray-900">Last Lessons</Text>
            <Text className="text-gray-400 font-medium">See All</Text>
        </View>

        <LessonRow
            title="History of Physics"
            time="12:00 PM"
            date="Nov 24"
            duration="45 min"
            iconColor="bg-pink-100"
        />
        <LessonRow
            title="Skeletal Biology"
            time="02:30 PM"
            date="Nov 24"
            duration="60 min"
            iconColor="bg-blue-100"
        />
    </ScrollView>
);

const ClassesRoute = () => (
    <View className="flex-1 bg-offWhite items-center justify-center">
        <Text className="text-gray-400">Classes Tab</Text>
    </View>
);

const renderScene = SceneMap({
    overview: OverviewRoute,
    classes: ClassesRoute,
});

export default function DashboardScreen() {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'overview', title: 'Schedule' },
        { key: 'classes', title: 'My Classes' },
    ]);

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'black', height: 3, borderRadius: 3 }}
            style={{ backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }}
            labelStyle={{ color: 'black', fontWeight: '700', textTransform: 'none', fontSize: 16 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            pressColor="transparent"
        />
    );

    return (
        <View className="flex-1 bg-offWhite pt-12">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 mb-2">
                <View className="flex-row items-center">
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                        className="w-10 h-10 rounded-full bg-gray-200 mr-3"
                    />
                    <View>
                        <Text className="text-gray-400 text-xs font-medium">Have a nice day</Text>
                        <Text className="text-xl font-bold text-gray-900">Hi, Admin</Text>
                    </View>
                </View>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100">
                    <Bell size={20} color="black" />
                </View>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
            />
        </View>
    );
}
