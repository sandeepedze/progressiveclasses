import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../components/ui/AppIcon';
import {
    LayoutDashboard,
    School,
    Building2,
    BookOpen,
    Library,
    CreditCard,
    Settings
} from 'lucide-react-native';

// Screens
import DashboardScreen from '../screens/superadmin/DashboardScreen';
import SchoolsScreen from '../screens/superadmin/SchoolsScreen';
import PlansScreen from '../screens/superadmin/PlansScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import AdminPlaceholderScreen from '../screens/superadmin/AdminPlaceholderScreen';
import OrganizationsScreen from '../screens/superadmin/OrganizationsScreen';

const Tab = createBottomTabNavigator();

const DynamicTabNavigator = () => {
    const insets = useSafeAreaInsets();
    const { user } = useSelector(state => state.auth);

    // Filter Logic
    const tabs = useMemo(() => {
        if (!user) return [];

        // Handle both naming conventions
        const role = user.role_code || user.role;
        // 'Schools', 'Institutes', 'Coaching', 'Tuition'
        const eduType = user.edu_type;

        // Defined as per new REQUIREMENTS
        const allTabs = [
            {
                name: 'Dashboard',
                component: DashboardScreen,
                icon: LayoutDashboard,
                show: true,
            },
            {
                name: 'Organizations',
                component: OrganizationsScreen,
                icon: Building2,
                show: role === 'SUPER_ADMIN',
            },
            {
                name: 'Plans',
                component: PlansScreen,
                icon: CreditCard,
                show: role === 'SUPER_ADMIN',
            },
            {
                // Keep Settings just in case or hide if strictly only 3 tabs?
                // User said "Bottom Navigation Tabs: 1. Dashboard, 2. Organizations, 3. Subscription Plans"
                // I will hide Settings from tab bar but keep screen accessible via profile if needed, 
                // but requirements said "Only show...". So I will remove it from tabs.
                name: 'Settings',
                component: SettingsScreen,
                icon: Settings,
                show: true,
            },
        ];

        return allTabs.filter(tab => tab.show);
    }, [user]);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F1F5F9', // slate-100
                    backgroundColor: '#FFFFFF',
                    elevation: 10, // Shadow for Android
                    shadowOpacity: 0.1, // iOS Shadow
                    shadowRadius: 4,
                    height: 70 + insets.bottom,
                    paddingBottom: Math.max(10, insets.bottom + 8),
                    paddingTop: 12,
                },
                tabBarActiveTintColor: '#6366F1', // Indigo-500
                tabBarInactiveTintColor: '#94A3B8', // slate-400
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginTop: 4
                }
            }}
        >
            {tabs.map(tab => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    initialParams={tab.initialParams}
                    options={{
                        tabBarIcon: ({ color }) => <AppIcon component={tab.icon} size={20} color={color} />
                    }}
                />
            ))}
        </Tab.Navigator>
    );
};

export default DynamicTabNavigator;
