export interface Delivery {
    id: string;
    customerName: string;
    address: string;
    cylinderType: 'Domestic' | 'Commercial';
    contactNumber: string;
    paymentStatus: 'Pending' | 'Paid';
    deliveryStatus: 'Assigned' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    amount: number;
    paymentMode?: 'Cash' | 'UPI';
    transactionId?: string;
}

export interface Driver {
    id: string;
    name: string;
    phone: string;
    role: 'Driver';
    isOnline: boolean;
}

// Emptied for real-time connection readiness
const mockDeliveries: Delivery[] = [];

export const mockApiService = {
    getDeliveries: async (): Promise<Delivery[]> => {
        return new Promise((resolve) => {
            // This will be replaced by: return axios.get('/api/deliveries')
            setTimeout(() => resolve(mockDeliveries), 1000);
        });
    },
    updateDeliveryStatus: async (id: string, status: Delivery['deliveryStatus']): Promise<void> => {
        return new Promise((resolve) => {
            // This will be replaced by: return axios.patch('/api/deliveries/' + id, { status })
            setTimeout(() => {
                const index = mockDeliveries.findIndex(d => d.id === id);
                if (index !== -1) {
                    mockDeliveries[index].deliveryStatus = status;
                }
                resolve();
            }, 500);
        });
    },
    confirmPayment: async (id: string, amount: number, mode: 'Cash' | 'UPI', txnId?: string): Promise<void> => {
        return new Promise((resolve) => {
            // This will be replaced by: return axios.post('/api/payments', { id, amount, mode, txnId })
            setTimeout(() => {
                const index = mockDeliveries.findIndex(d => d.id === id);
                if (index !== -1) {
                    mockDeliveries[index].paymentStatus = 'Paid';
                    mockDeliveries[index].deliveryStatus = 'Delivered';
                    mockDeliveries[index].paymentMode = mode;
                    mockDeliveries[index].amount = amount;
                    mockDeliveries[index].transactionId = txnId;
                }
                resolve();
            }, 800);
        });
    }
};
