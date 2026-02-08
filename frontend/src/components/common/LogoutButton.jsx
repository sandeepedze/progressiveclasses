import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, View } from 'react-native';
import { LogOut, AlertTriangle } from 'lucide-react-native';

const LogoutButton = ({ onLogout }) => {
    const [visible, setVisible] = useState(false);

    const handleConfirm = () => {
        setVisible(false);
        onLogout();
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                className="flex-row items-center justify-center bg-red-50 p-4 rounded-xl mt-6 border border-red-100 active:bg-red-100"
            >
                <LogOut size={20} color="#DC2626" style={{ marginRight: 8 }} />
                <Text className="text-red-600 font-bold text-base">Log Out</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <View className="flex-1 bg-black/50 items-center justify-center p-4">
                    <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <View className="items-center mb-4">
                            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4">
                                <AlertTriangle size={24} color="#DC2626" />
                            </View>
                            <Text className="text-lg font-bold text-slate-900 text-center">
                                Confirm Logout
                            </Text>
                            <Text className="text-slate-500 text-center mt-2">
                                Are you sure you want to end your session?
                            </Text>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                                className="flex-1 bg-slate-100 py-3 rounded-lg items-center"
                            >
                                <Text className="text-slate-700 font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirm}
                                className="flex-1 bg-red-600 py-3 rounded-lg items-center"
                            >
                                <Text className="text-white font-bold">Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default LogoutButton;
