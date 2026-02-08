import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { toggleTheme } from '../../features/ui/uiSlice';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const ThemeWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.ui.theme);
    const paddingBottom = Platform.OS === 'android' ? 10 : 0;
    useEffect(() => {
        (async () => {
            const stored = await SecureStore.getItemAsync('appTheme');
            if (stored && stored !== theme) {
                // toggle to match stored (simple approach)
                if ((stored === 'dark' && theme !== 'dark') || (stored === 'light' && theme !== 'light')) {
                    dispatch(toggleTheme());
                }
            }
        })();
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" translucent={false} />
            {children}
        </SafeAreaProvider>
    );
};

export default ThemeWrapper;
