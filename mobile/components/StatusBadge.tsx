import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface StatusBadgeProps {
    status: string;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'Delivered':
        case 'Paid':
            return { bg: Colors.success + '20', text: Colors.success };
        case 'Out for Delivery':
        case 'Pending':
            return { bg: Colors.warning + '20', text: Colors.warning };
        case 'Cancelled':
            return { bg: Colors.danger + '20', text: Colors.danger };
        case 'Assigned':
            return { bg: Colors.primary + '20', text: Colors.primary };
        default:
            return { bg: Colors.secondary + '20', text: Colors.secondary };
    }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles_config = getStatusStyles(status);

    return (
        <View style={[styles.badge, { backgroundColor: styles_config.bg }]}>
            <Text style={[styles.text, { color: styles_config.text }]}>{status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '700',
    },
});
