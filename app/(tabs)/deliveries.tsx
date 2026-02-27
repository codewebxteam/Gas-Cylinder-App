import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { DeliveryCard } from '../../components/DeliveryCard';
import { Colors } from '../../constants/Colors';
import { Delivery, mockApiService } from '../../services/mockApi';

export default function DeliveriesScreen() {
    const router = useRouter();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const data = await mockApiService.getDeliveries();
            setDeliveries(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load deliveries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const handleUpdateStatus = async (id: string, status: Delivery['deliveryStatus']) => {
        if (status === 'Cancelled') {
            Alert.alert(
                'Cancel Delivery',
                'Are you sure you want to cancel this delivery?',
                [
                    { text: 'No', style: 'cancel' },
                    {
                        text: 'Yes, Cancel',
                        style: 'destructive',
                        onPress: async () => {
                            await mockApiService.updateDeliveryStatus(id, 'Cancelled');
                            setDeliveries(prev => prev.map(d => d.id === id ? { ...d, deliveryStatus: 'Cancelled' } : d));
                        }
                    }
                ]
            );
            return;
        }

        await mockApiService.updateDeliveryStatus(id, status);
        setDeliveries(prev => prev.map(d => d.id === id ? { ...d, deliveryStatus: status } : d));
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color={Colors.border} />
            <Text style={styles.emptyTitle}>No Deliveries Assigned</Text>
            <Text style={styles.emptySubtitle}>You're all caught up for today!</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {['All', 'Assigned', 'Out for Delivery', 'Delivered', 'Cancelled'].map((filter) => (
                        <TouchableOpacity key={filter} style={[styles.filterChip, filter === 'All' && styles.activeFilterChip]}>
                            <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={deliveries}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <DeliveryCard
                        delivery={item}
                        onPress={() => router.push(`/delivery/${item.id}` as any)}
                        onStart={() => handleUpdateStatus(item.id, 'Out for Delivery')}
                        onDeliver={() => router.push(`/delivery/${item.id}` as any)}
                        onCancel={() => handleUpdateStatus(item.id, 'Cancelled')}
                    />
                )}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
            />
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
    filterContainer: {
        backgroundColor: Colors.surface,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activeFilterChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textLight,
    },
    activeFilterText: {
        color: Colors.surface,
    },
    listContent: {
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 8,
    },
});
