import './global.css';
import React from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { setupAxiosInterceptors } from './src/services/apiClient';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/context/ToastContext';
import ThemeWrapper from './src/components/system/ThemeWrapper';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// Initialize Axios Interceptors with Store
setupAxiosInterceptors(store);

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <NavigationContainer>
                    <ToastProvider>
                        <ThemeWrapper>
                            <AppNavigator />
                        </ThemeWrapper>
                    </ToastProvider>
                </NavigationContainer>
            </Provider>
        </GestureHandlerRootView>
    );
}
