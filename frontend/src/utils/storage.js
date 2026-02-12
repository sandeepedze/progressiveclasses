import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const setItem = async (key, value) => {
    try {
        if (isWeb) {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    } catch (error) {
        console.error('Error setting item:', error);
        throw error;
    }
};

const getItem = async (key) => {
    try {
        if (isWeb) {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error('Error getting item:', error);
        return null;
    }
};

const deleteItem = async (key) => {
    try {
        if (isWeb) {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

export const storage = {
    setItem,
    getItem,
    deleteItem
};
