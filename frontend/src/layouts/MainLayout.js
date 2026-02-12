import React from 'react';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/theme';
import { useSelector } from 'react-redux';

const MainLayout = ({ children }) => {
    const theme = useSelector(state => state.ui?.theme) || 'light';
    return (
        <LinearGradient
            colors={[COLORS.backgroundDeep, COLORS.backgroundSlate]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
        >
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={COLORS.backgroundDeep} />
            <SafeAreaView className="flex-1">
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MainLayout;
