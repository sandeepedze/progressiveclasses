import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services';
import { useToast } from '../../context/ToastContext';
import AppHeader from '../../components/layout/AppHeader'; // Assuming this exists or creates generic header
// Note: AppHeader might expect "showBack" prop.
import { GraduationCap, Building2, BookOpen, Library } from 'lucide-react-native';

const ICON_MAP = {
    'Schools': <GraduationCap size={24} color="#6366F1" />,
    'Institutes': <Building2 size={24} color="#F59E0B" />,
    'Coaching': <BookOpen size={24} color="#10B981" />,
    'Tuition': <Library size={24} color="#EC4899" />,
    // Default fallback
    'default': <Building2 size={24} color="#64748B" />
};

const SelectOrganizationScreen = ({ navigation }) => {
    const { showToast } = useToast();
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const data = await authService.getEduTypes();
            setTypes(data);
        } catch (error) {
            showToast('Failed to fetch organization types', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (type) => {
        navigation.navigate('SetupOrganization', { eduType: type });
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="px-6 py-4">
                <Text className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    Organization Type
                </Text>
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                    Select your institution category
                </Text>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <View className="px-6 mt-4">
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => handleSelect(type)}
                            activeOpacity={0.7}
                            className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 mb-4 flex-row items-center"
                        >
                            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm mr-4">
                                {ICON_MAP[type.type_name] || ICON_MAP['default']}
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-slate-800">
                                    {type.type_name}
                                </Text>
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                                    Setup {type.type_name} Account
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </SafeAreaView>
    );
};

export default SelectOrganizationScreen;
