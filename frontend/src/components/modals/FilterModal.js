import React from 'react';
import { View } from 'react-native';
import AppInput from '../ui/AppInput';

const FilterForm = ({ filters, setFilters }) => {
    return (
        <View className="space-y-1">
            <AppInput
                label="Search by Name / Code"
                placeholder="Search..."
                value={filters.search}
                onChangeText={(t) => setFilters({ ...filters, search: t })}
            />
            <View className="flex-row justify-between">
                <View className="w-[48%]">
                    <AppInput
                        label="Date From"
                        placeholder="DD/MM/YYYY"
                        value={filters.dateFrom}
                        onChangeText={(t) => setFilters({ ...filters, dateFrom: t })}
                    />
                </View>
                <View className="w-[48%]">
                    <AppInput
                        label="Date To"
                        placeholder="DD/MM/YYYY"
                        value={filters.dateTo}
                        onChangeText={(t) => setFilters({ ...filters, dateTo: t })}
                    />
                </View>
            </View>
            <AppInput
                label="Location / Area"
                placeholder="Enter city or area"
                value={filters.location}
                onChangeText={(t) => setFilters({ ...filters, location: t })}
            />
        </View>
    );
};

export default FilterForm;
