<template>
    <div class="fill-height">

        <v-card class="fill-height">
            <div class="d-flex align-center justify-space-between w-100 mt-4">
                <v-card-title>Orders</v-card-title>
            </div>
            <v-card-text>
                <!-- Order List Table -->
                <v-data-table class="border rounded-lg" :headers="headers" :items="orders" item-key="id">
                    <template v-slot:[`item.order_id`]="{ item }">
                        <p>{{ item.order_id }}</p>
                    </template>
                    <template v-slot:[`item.created`]="{ item }">
                        <p>{{ new Date(item.created).toLocaleDateString() }}</p>
                    </template>
                    <template v-slot:[`item.customer_name`]="{ item }">
                        <p>{{ item.customer_name }}</p>
                    </template>
                    <template v-slot:[`item.order_items`]="{ item }">
                        <p>{{ item.order_items?.length }}</p>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                        <p :class="{'text-blue-darken-2':item.status=='Pending','text-green-darken-2':item.status=='Completed','text-red-darken-2':item.status=='Cancelled'}">{{ item.status }}</p>
                    </template>
                    <template v-slot:[`item.total_amount`]="{ item }">
                        <p>₹{{ item.total_amount }}</p>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn variant="text" @click="viewOrder(item)">View</v-btn>
                        <v-btn variant="text" color="red" @click="cancelOrder(item.id)">Cancel</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!-- Order Details Dialog -->
        <v-dialog v-model="showOrderDialog" max-width="720px">
            <v-card class="pa-5">
                <v-card-title>Order Details</v-card-title>
                <v-card-text class="pa-0">
                    <div v-if="selectedOrder">
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Order ID: </span>
                            <span>{{ selectedOrder.order_id }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Date: </span>
                            <span>{{ new Date(selectedOrder.created).toLocaleDateString() }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Customer Name: </span>
                            <span>{{ selectedOrder.customer_name }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Customer Phone: </span>
                            <span>{{ selectedOrder.customer_phone }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Customer Address: </span>
                            <span>
                                <span>{{ selectedOrder.customer_address }}, </span>
                                <span>{{ selectedOrder.customer_city }}, </span>
                                <span>{{ selectedOrder.customer_state }}, </span>
                                <span class="font-weight-bold">{{ selectedOrder.customer_pincode }}</span>
                            </span>
                        </v-card-subtitle>
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Total Bill: </span>
                            <span class="text-green-darken-2 font-weight-medium">₹{{ selectedOrder.total_amount }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="mb-2 d-flex justify-space-between">
                            <span class="font-weight-medium">Status: </span>
                            <span class="font-weight-medium" :class="{'text-blue-darken-2':selectedOrder.status=='Pending','text-green-darken-2':selectedOrder.status=='Completed','text-red-darken-2':selectedOrder.status=='Cancelled'}">{{ selectedOrder.status }}</span>
                        </v-card-subtitle>

                        <v-card-title>Ordered Items</v-card-title>
                        <v-list>
                            <v-list-item-group v-for="item in selectedOrder.order_items" :key="item.product_id">
                                <v-list-item :prepend-avatar="`data:image/jpeg;base64,${item.thumbnail}`" class="border rounded mb-1 pb-2 pt-1">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.product_name }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            <span>Quantity: </span>
                                            <span class="font-weight-medium">{{ item.quantity }}</span> | 
                                            <span>Price: </span>
                                            <span class="font-weight-medium">₹{{ item.price }}</span> | 
                                            <span>Discount: </span>
                                            <span class="font-weight-medium">{{ item.discount }}%</span>
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle class="my-1">
                                            <span>Amount: </span>
                                            <span class="text-green-darken-2 font-weight-medium">₹{{ (item.price - (item.price * item.discount / 100)) * item.quantity }}</span>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </div>
                    <div v-else>
                        <p>No order selected</p>
                    </div>
                </v-card-text>
                <v-select class="mt-2" variant="outlined" density="compact" :items="order_status" v-model="new_status" placeholder="Update Status"></v-select>
                <div class="d-flex justify-end">
                    <v-btn class="ml-2" variant="text" @click="statusUpdate" color="green" v-if="new_status">Update</v-btn>
                    <v-btn class="ml-2" variant="text" @click="showOrderDialog = false">Close</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            orders: [], // Array to store orders
            showOrderDialog: false, // Flag to control visibility of order details dialog
            headers: [ // Table headers
                { title: 'Order ID', value: 'order_id' },
                { title: 'Date', value: 'created' },
                { title: 'Customer', value: 'customer_name' },
                { title: 'Items', value: 'order_items' },
                { title: 'Total', value: 'total_amount' },
                { title: 'Status', value: 'status' },
                { title: 'Actions', value: 'actions', sortable: false },
            ],
            new_status:null,
            order_status:[
                {
                    title:'Pending',
                    value:'Pending'
                },
                {
                    title:'Completed',
                    value:'Completed'
                },
                {
                    title:'Cancelled',
                    value:'Cancelled'
                }
            ],
            selectedOrder: null,
        };
    },
    methods: {
        // Method to view order details
        // Method to view order details
        viewOrder(order) {
            this.selectedOrder = order;
            this.showOrderDialog = true;
        },
        // Method to cancel an order
        cancelOrder(orderId) {
            // cancel order logic goes here
            this.orders = this.orders.filter((order) => order.id !== orderId);
        },
        // Method to fetch orders (if required)
        async fetchOrders() {
            try {
                const res = await this.axios.get('/admin/orders');
                this.orders = res.data;
            } catch (error) {
                console.error(error)
            }
        },
        async statusUpdate() {
            try {
                const formData = {
                    status:this.new_status,
                    order_id:this.selectedOrder.order_id
                }
                const res = await this.axios.post('/admin/order/status',formData);
                this.fetchOrders();
            } catch (error) {
                console.error(error)
            }
        },
    },
    mounted() {
        // Fetch orders when the component is mounted
        this.fetchOrders();
    },
};
</script>
  
  <!-- ... (existing styles) ... -->
  