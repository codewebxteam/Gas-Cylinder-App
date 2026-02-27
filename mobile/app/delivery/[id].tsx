import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { PaymentSelector } from '../../components/PaymentSelector';
import { StatusBadge } from '../../components/StatusBadge';
import { Colors } from '../../constants/Colors';
import { Delivery, mockApiService } from '../../services/mockApi';

export default function DeliveryDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | null>(null);
    const [amount, setAmount] = useState('');
    const [txnId, setTxnId] = useState('');
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        const fetchDelivery = async () => {
            const data = await mockApiService.getDeliveries();
            const item = data.find(d => d.id === id);
            if (item) {
                setDelivery(item);
                setAmount(item.amount.toString());
                if (item.paymentStatus === 'Paid') {
                    setPaymentMode(item.paymentMode || null);
                    setTxnId(item.transactionId || '');
                }
            }
            setLoading(false);
        };
        fetchDelivery();
    }, [id]);

    const handleConfirmPayment = async () => {
        if (!paymentMode) {
            Alert.alert('Error', 'Please select a payment mode');
            return;
        }
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (paymentMode === 'UPI' && !txnId) {
            Alert.alert('Error', 'Please enter UPI Transaction ID');
            return;
        }

        setConfirming(true);
        try {
            await mockApiService.confirmPayment(delivery!.id, Number(amount), paymentMode, txnId);
            setDelivery(prev => prev ? { ...prev, paymentStatus: 'Paid', deliveryStatus: 'Delivered', paymentMode, amount: Number(amount), transactionId: txnId } : null);
            Alert.alert('Success', 'Payment confirmed and delivery marked as completed');
        } catch (error) {
            Alert.alert('Error', 'Failed to confirm payment');
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!delivery) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Delivery not found</Text>
            </View>
        );
    }

    const isPaid = delivery.paymentStatus === 'Paid';

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Delivery Details', headerShown: true }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Customer Details</Text>
                            <StatusBadge status={delivery.deliveryStatus} />
                        </View>
                        <View style={styles.card}>
                            <View style={styles.infoRow}>
                                <Ionicons name="person-outline" size={20} color={Colors.primary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.label}>Name</Text>
                                    <Text style={styles.value}>{delivery.customerName}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={20} color={Colors.primary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.label}>Contact</Text>
                                    <Text style={styles.value}>{delivery.contactNumber}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="cube-outline" size={20} color={Colors.primary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.label}>Cylinder Type</Text>
                                    <Text style={styles.value}>{delivery.cylinderType}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <View style={styles.card}>
                            <Text style={styles.addressText}>{delivery.address}</Text>
                            <View style={styles.mapPlaceholder}>
                                <Ionicons name="map-outline" size={40} color={Colors.border} />
                                <Text style={styles.mapText}>Map Preview Placeholder</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Payment Section</Text>
                            <StatusBadge status={delivery.paymentStatus} />
                        </View>
                        <View style={styles.card}>
                            <PaymentSelector
                                selectedMode={paymentMode}
                                onSelect={!isPaid ? setPaymentMode : () => { }}
                            />

                            <Text style={styles.inputLabel}>Amount to Collect</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.currency}>₹</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                    editable={!isPaid}
                                />
                            </View>

                            {paymentMode === 'UPI' && (
                                <View style={styles.upiSection}>
                                    <View style={styles.qrPlaceholder}>
                                        <Ionicons name="qr-code" size={100} color={Colors.text} />
                                        <Text style={styles.qrText}>Scan for Payment</Text>
                                    </View>
                                    <Text style={styles.inputLabel}>Transaction ID</Text>
                                    <TextInput
                                        style={[styles.input, styles.borderedInput]}
                                        placeholder="Enter TXN ID"
                                        value={txnId}
                                        onChangeText={setTxnId}
                                        editable={!isPaid}
                                    />
                                </View>
                            )}

                            {!isPaid && (
                                <CustomButton
                                    title="Confirm Payment"
                                    onPress={handleConfirmPayment}
                                    loading={confirming}
                                    style={styles.confirmBtn}
                                    variant="success"
                                    size="lg"
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoText: {
        marginLeft: 12,
    },
    label: {
        fontSize: 12,
        color: Colors.textLight,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 2,
    },
    addressText: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 22,
        marginBottom: 16,
    },
    mapPlaceholder: {
        height: 150,
        backgroundColor: Colors.background,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    mapText: {
        color: Colors.textLight,
        marginTop: 8,
        fontSize: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    currency: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginRight: 4,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    upiSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    qrPlaceholder: {
        alignItems: 'center',
        marginBottom: 20,
    },
    qrText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    borderedInput: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        fontSize: 16,
        fontWeight: '500',
    },
    confirmBtn: {
        marginTop: 24,
    },
});
