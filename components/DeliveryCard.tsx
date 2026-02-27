import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { CustomButton } from './CustomButton';
import { StatusBadge } from './StatusBadge';

interface DeliveryCardProps {
    delivery: {
        id: string;
        customerName: string;
        address: string;
        cylinderType: string;
        contactNumber: string;
        paymentStatus: string;
        deliveryStatus: string;
        amount: number;
    };
    onPress: () => void;
    onStart: () => void;
    onDeliver: () => void;
    onCancel: () => void;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
    delivery,
    onPress,
    onStart,
    onDeliver,
    onCancel
}) => {
    const handleCall = () => {
        Linking.openURL(`tel:${delivery.contactNumber}`);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.customerName}>{delivery.customerName}</Text>
                    <Text style={styles.cylinderType}>{delivery.cylinderType} Cylinder</Text>
                </View>
                <StatusBadge status={delivery.deliveryStatus} />
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={Colors.textLight} />
                <Text style={styles.address} numberOfLines={2}>{delivery.address}</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.paymentInfo}>
                    <Text style={styles.price}>₹{delivery.amount}</Text>
                    <StatusBadge status={delivery.paymentStatus} />
                </View>

                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Ionicons name="call" size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.actions}>
                {delivery.deliveryStatus === 'Assigned' && (
                    <CustomButton
                        title="Start Delivery"
                        onPress={onStart}
                        size="sm"
                        style={styles.actionBtn}
                    />
                )}
                {delivery.deliveryStatus === 'Out for Delivery' && (
                    <CustomButton
                        title="Mark Delivered"
                        onPress={onDeliver}
                        variant="success"
                        size="sm"
                        style={styles.actionBtn}
                    />
                )}
                {(delivery.deliveryStatus === 'Assigned' || delivery.deliveryStatus === 'Out for Delivery') && (
                    <CustomButton
                        title="Cancel"
                        onPress={onCancel}
                        variant="outline"
                        size="sm"
                        style={[styles.actionBtn, { borderColor: Colors.danger } as any]}
                        textStyle={{ color: Colors.danger }}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    customerName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    cylinderType: {
        fontSize: 13,
        color: Colors.textLight,
        marginTop: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    address: {
        fontSize: 14,
        color: Colors.textLight,
        marginLeft: 6,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 12,
        marginBottom: 12,
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.text,
        marginRight: 8,
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        flex: 1,
    },
});
