import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function HomeScreen() {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user?.email}!</Text>
            <Text style={styles.role}>Role: {user?.role}</Text>
            <Button title="Logout" onPress={() => dispatch(logout())} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 20,
        marginBottom: 10,
    },
    role: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
});
