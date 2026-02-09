import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { School, LayoutDashboard, CreditCard, Settings } from 'lucide-react-native';
import AppIcon from '../components/ui/AppIcon';
import SuperAdminDashboard from '../screens/superadmin/DashboardScreen';
import SchoolsScreen from '../screens/superadmin/SchoolsScreen';
import CreateSchoolScreen from '../screens/superadmin/CreateSchoolScreen';
import BulkImportSchoolsScreen from '../screens/superadmin/BulkImportSchoolsScreen';
import FilterSchoolsScreen from '../screens/superadmin/FilterSchoolsScreen';
import PlansScreen from '../screens/superadmin/PlansScreen';
import CreatePlanScreen from '../screens/superadmin/CreatePlanScreen';
import FilterPlansScreen from '../screens/superadmin/FilterPlansScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import SecurityScreen from '../screens/common/SecurityScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SuperAdminTabs = () => {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F1F5F9', // slate-100
                    backgroundColor: '#FFFFFF',
                    elevation: 10, // Shadow for Android
                    shadowOpacity: 5,
                    height: 70 + insets.bottom,
                    paddingBottom: Math.max(10, insets.bottom + 8),
                    paddingTop: 12,
                },
                tabBarActiveTintColor: '#6366F1', // Indigo-500
                tabBarInactiveTintColor: '#94A3B8', // slate-400
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginTop: 4
                }
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={SuperAdminDashboard}
                options={{
                    tabBarIcon: ({ color }) => <AppIcon component={LayoutDashboard} size={20} color={color} />
                }}
            />
            <Tab.Screen
                name="Schools"
                component={SchoolsScreen}
                options={{
                    tabBarIcon: ({ color }) => <AppIcon component={School} size={20} color={color} />
                }}
            />
            <Tab.Screen
                name="Plans"
                component={PlansScreen}
                options={{
                    tabBarIcon: ({ color }) => <AppIcon component={CreditCard} size={20} color={color} />
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color }) => <AppIcon component={Settings} size={20} color={color} />
                }}
            />
        </Tab.Navigator>
    );
};

const SuperAdminNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'card' }}>
            <Stack.Screen name="SuperAdminTabs" component={SuperAdminTabs} />
            <Stack.Screen name="CreateSchool" component={CreateSchoolScreen} />
            <Stack.Screen name="BulkImport" component={BulkImportSchoolsScreen} />
            <Stack.Screen name="FilterSchools" component={FilterSchoolsScreen} />
            <Stack.Screen name="CreatePlan" component={CreatePlanScreen} />
            <Stack.Screen name="FilterPlans" component={FilterPlansScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
        </Stack.Navigator>
    );
};

export default SuperAdminNavigator;
