import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateSchoolScreen from '../screens/superadmin/CreateSchoolScreen';
import CreatePlanScreen from '../screens/superadmin/CreatePlanScreen';
import FilterPlansScreen from '../screens/superadmin/FilterPlansScreen';
import BulkImportSchoolsScreen from '../screens/superadmin/BulkImportSchoolsScreen';
import FilterSchoolsScreen from '../screens/superadmin/FilterSchoolsScreen';

import ProfileScreen from '../screens/common/ProfileScreen';
import SecurityScreen from '../screens/common/SecurityScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DynamicTabNavigator from './DynamicTabNavigator';

import AddOrganizationScreen from '../screens/superadmin/AddOrganizationScreen';

const Stack = createStackNavigator();

const SuperAdminNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'card' }}>
            <Stack.Screen name="SuperAdminTabs" component={DynamicTabNavigator} />
            <Stack.Screen name="AddOrganization" component={AddOrganizationScreen} />
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
