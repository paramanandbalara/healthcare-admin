<template>
    <v-sheet class="py-5 px-lg-15 bg-grey-lighten-4 fill-height">
        <v-container fluid>
            <v-card>
                <v-card-title class="text-h6 pa-4">Your Order History</v-card-title>
        
                <v-list>
                    <v-list-item v-if="!orders?.length">No orders found.</v-list-item>
                    <v-list-item v-else v-for="order in orders" :key="order.id">
                        <div class="d-flex justify-space-between border-b pb-4">
                            <v-list-item-content>
                                <v-list-item-title>Order Id:{{ order.id }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ formatDate(order.created) }} - {{ formatTime(order.created) }} - Total: ₹{{ order.total_amount }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn variant="flat" :to="{ name: 'OrderDetails', params: { id: order.id } }">View Details</v-btn>
                            </v-list-item-action>
                        </div>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-container>
    </v-sheet>
</template>
  
<script>
import { useAppStore } from '@/store/app';

export default {
    data() {
        return {
            orders: [] // Initialize as an empty array
        };
    },
    created() {
        // Fetch user's order history from an API
        this.fetchOrderHistory();
    },
    computed: {
        store() {
            return useAppStore()
        },
        user_id() {
            return this.store.user.id
        }
    },
    methods: {
        async fetchOrderHistory() {
            // Make an API call to fetch the user's order history
            try {
                const res = await this.axios.get(`/order/history?userId=${this.user_id}`);
                this.orders = res.data.data;
            } catch (error) {
                console.error(error)
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString(); // Placeholder
        },
        formatTime(date) {
            return new Date(date).toLocaleTimeString(); // Placeholder
        },
        viewOrderDetails(orderId) {
            // Redirect or display detailed view of the selected order
            // Example: this.$router.push(`/order-details/${orderId}`);
            console.log(`View details for order ${orderId}`);
        }
    }
};
</script>
  
<style scoped>
/* Customize styles as per your design */
</style>
  