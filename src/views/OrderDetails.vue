<template>
    <v-sheet class="py-5 px-lg-15 bg-grey-lighten-4 fill-height">
        <v-container fluid>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title class="py-4">Order Details</v-card-title>
                        <v-divider class="mb-2"></v-divider>
    
                        <!-- Display order details here -->
                        <v-list class="pa-4">
                            <v-list-item-group v-if="orderDetails.length">
                                <v-list-item-subtitle class="mb-2">
                                    <span class="font-weight-medium">Order id: </span>
                                    {{ orderDetails[0].order_id }}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    <span class="font-weight-medium">Order Date: </span>
                                    {{ new Date(orderDetails[0].order_date).toLocaleDateString() }}
                                </v-list-item-subtitle>
                                <v-list-item :prepend-avatar="`data:image/jpeg;base64,${item.thumbnail}`" class="border-b px-0 py-4" v-for="item in orderDetails" :key="item.id">
                                    <div class="d-block d-md-flex justify-space-between">
                                        <!-- <v-img cover style="width: 100px;" :src="`data:image/jpeg;base64,${item.thumbnail}`" alt="Product Image"></v-img> -->
                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.product_name }}</v-list-item-title>
                                            <v-list-item-subtitle>Quantity: {{ item.quantity }} | Price: ₹{{ item.price
                                            }} | Discount: {{ item.discount }}%</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-title class="font-weight-medium">Amount: ₹{{ (item.price - (item.price * item.discount / 100)) * item.quantity }}</v-list-item-title>
                                    </div>
                                </v-list-item>
                                <div class="d-flex justify-space-between py-4">
                                    <v-list-item-title class="font-weight-medium">Total:</v-list-item-title>
                                    <v-list-item-title class="font-weight-medium">₹{{ totalDiscountedPrice }}</v-list-item-title>
                                </div>
                            </v-list-item-group>
                            <v-list-item v-else>
                                <v-list-item-content>No items in this order.</v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>
  
<script>
export default {
    data() {
        return {
            orderDetails: [],
        };
    },
    mounted() {
        // Fetch order details when the component is mounted
        this.fetchOrderDetails();
    },
    computed: {
        orderId() {
            console.log(this.$route.params)
            return this.$route.params.id
        },
		totalDiscountedPrice() {
			return this.orderDetails.reduce((acc, item) => acc + ((item.price - (item.price * item.discount / 100)) * item.quantity), 0).toFixed(2);
		},
    },
    methods: {
        async fetchOrderDetails() {
            try {
                // Make an API call to fetch order details based on the orderId
                // Replace the URL with your actual API endpoint
                const res = await this.axios.get(`/order/details?orderId=${this.orderId}`);
                console.log(res.data.data)
                this.orderDetails = res.data.data;
                
            } catch (error) {
                console.error(error)
            }
        },
    },
};
</script>
  
<style scoped>
/* Add custom styles as needed */
</style>
  