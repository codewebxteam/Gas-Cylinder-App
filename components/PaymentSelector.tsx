import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface PaymentSelectorProps {
    selectedMode: 'Cash' | 'UPI' | null;
    onSelect: (mode: 'Cash' | 'UPI') => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selectedMode, onSelect }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Payment Mode</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[
                        styles.option,
                        selectedMode === 'Cash' && styles.selectedOption
                    ]}
                    onPress={() => onSelect('Cash')}
                >
                    <Ionicons
                        name="cash-outline"
                        size={24}
                        color={selectedMode === 'Cash' ? Colors.surface : Colors.text}
                    />
                    <Text style={[
                        styles.optionText,
                        selectedMode === 'Cash' && styles.selectedOptionText
                    ]}>Cash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.option,
                        selectedMode === 'UPI' && styles.selectedOption
                    ]}
                    onPress={() => onSelect('UPI')}
                >
                    <Ionicons
                        name="qr-code-outline"
                        size={24}
                        color={selectedMode === 'UPI' ? Colors.surface : Colors.text}
                    />
                    <Text style={[
                        styles.optionText,
                        selectedMode === 'UPI' && styles.selectedOptionText
                    ]}>UPI</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        gap: 8,
    },
    selectedOption: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    selectedOptionText: {
        color: Colors.surface,
    },
});
