import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface SummaryCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, color = Colors.primary }) => {
    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                {icon}
            </View>
            <View>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.label}>{label}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    value: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.text,
    },
    label: {
        fontSize: 12,
        color: Colors.textLight,
    },
});
