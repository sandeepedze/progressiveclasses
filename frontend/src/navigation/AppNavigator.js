import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import SelectOrganizationScreen from '../screens/auth/SelectOrganizationScreen';
import SetupOrganizationScreen from '../screens/auth/SetupOrganizationScreen';

// Navigators
import SuperAdminNavigator from './SuperAdminNavigator';
import MainTabNavigator from './MainTabNavigator';

// Redux & Theme
import { restoreToken } from '../features/auth/authSlice';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading, user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(restoreToken());
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                // Logic Flow:
                // 1. Check if Super Admin -> Dashboard directly (skip onboarding)
                // 2. Check if Setup Complete -> Dashboard
                // 3. Else -> Onboarding Flow

                (user?.role_code === 'SUPER_ADMIN' || user?.role === 'super_admin') ? (
                    <Stack.Screen name="SuperAdminRoot" component={SuperAdminNavigator} />
                ) : !user?.is_setup_complete ? (
                    // Onboarding Flow
                    <>
                        <Stack.Screen name="SelectOrganization" component={SelectOrganizationScreen} />
                        <Stack.Screen name="SetupOrganization" component={SetupOrganizationScreen} />
                    </>
                ) : (user?.role_code === 'SCHOOL_ADMIN' || user?.role === 'school_admin') ? (
                    <Stack.Screen name="SchoolAdminRoot" component={SuperAdminNavigator} />
                ) : (
                    // Default / Other Users -> MainTabNavigator
                    <Stack.Screen name="UserRoot" component={MainTabNavigator} />
                )
            ) : (
                // Auth Flow
                <>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}
