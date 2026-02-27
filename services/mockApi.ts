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

const mockDeliveries: Delivery[] = [];

export const mockApiService = {
    getDeliveries: async (): Promise<Delivery[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockDeliveries), 1000);
        });
    },
    updateDeliveryStatus: async (id: string, status: Delivery['deliveryStatus']): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 500);
        });
    },
    confirmPayment: async (id: string, amount: number, mode: 'Cash' | 'UPI', txnId?: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 800);
        });
    },
    getDriverProfile: async (): Promise<Driver> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({
                id: 'USER_ID',
                name: 'Delivery Partner',
                phone: '+91 00000 00000',
                role: 'Driver',
                isOnline: true,
            }), 500);
        });
    }
};
