import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { schoolService } from '../../services';
import { useToast } from '../../context/ToastContext';
import AppHeader from '../../components/layout/AppHeader';
import AppButton from '../../components/ui/AppButton';
import { ScreenWrapper } from '../../components/ui/system/SystemComponents';

const BulkImportSchoolsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel'
                ],
            });

            if (result.canceled) return;
            setSelectedFile(result.assets[0]);
        } catch (error) {
            showToast('Failed to pick document', 'error');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showToast('Please select a file first', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const response = await schoolService.uploadXlsx(formData);
            showToast(`${response.data.success} schools imported!`, 'success');
            setTimeout(() => navigation.goBack(), 1500);
        } catch (error) {
            showToast(error.message || 'Import failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper loading={isLoading}>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <AppHeader title="Bulk Import Protocol" />

                <ScrollView
                    className="flex-1 px-5"
                    contentContainerStyle={{ paddingTop: 32, paddingBottom: insets.bottom + 40 }}
                >
                    <View className="items-center mb-10">
                        <View className="w-20 h-20 rounded-[24px] bg-indigo-50 items-center justify-center mb-6 border border-indigo-100 shadow-sm shadow-indigo-50">
                            <Upload size={32} color="#6366F1" />
                        </View>
                        <Text className="text-xl font-bold text-slate-800 text-center uppercase tracking-tighter">Automated Registry</Text>
                        <Text className="text-slate-400 text-center mt-2 font-black uppercase tracking-[2px] text-[10px] px-6">
                            Upload your institutional data using the standardized .xlsx template.
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handlePickDocument}
                        className={`w-full p-8 rounded-[32px] border-2 border-dashed items-center justify-center mb-10 ${selectedFile ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}
                    >
                        {selectedFile ? (
                            <>
                                <CheckCircle2 size={40} color="#10B981" />
                                <Text className="mt-4 text-emerald-600 font-bold text-sm text-center">{selectedFile.name}</Text>
                                <Text className="mt-1 text-emerald-400 font-black uppercase text-[8px] tracking-widest">File Verified</Text>
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet size={40} color="#94A3B8" />
                                <Text className="mt-4 text-slate-500 font-bold text-sm">Select Spreadsheet</Text>
                                <Text className="mt-1 text-slate-400 font-black uppercase text-[8px] tracking-widest">XLSX or XLS supported</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View className="bg-indigo-50 p-6 rounded-[24px] border border-indigo-100 mb-12">
                        <View className="flex-row items-start">
                            <AlertCircle size={18} color="#6366F1" className="mt-0.5" />
                            <View className="ml-3 flex-1">
                                <Text className="text-indigo-900 font-bold text-xs uppercase tracking-tight">Requirement Traceability</Text>
                                <Text className="text-indigo-400 text-[10px] mt-1 leading-relaxed">
                                    Ensure all required fields (School Name, Code, Admin Email) are populated in the template to avoid ingestion errors.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <AppButton
                        title="Execute Data Ingestion"
                        onPress={handleUpload}
                        disabled={!selectedFile}
                        loading={isLoading}
                    />
                </ScrollView>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

export default BulkImportSchoolsScreen;
