<template>
    <v-container>
        <v-row>
            <!-- Sidebar - Customer Details and Product/Service Selection -->
            <v-col cols="4">
                <v-card class="pa-5">
                    <v-card-title>Customer Details</v-card-title>
                    <v-form ref="customerForm">
                        <v-text-field v-model="customer.name" label="Customer Name"></v-text-field>
                        <v-text-field v-model="customer.mobile" label="Mobile Number"></v-text-field>
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="customer.date" label="Select Date" v-bind="attrs"
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="customer.date" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                <v-btn text color="primary" @click="$refs.customerForm.validate()">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-form>

                    <v-divider></v-divider>

                    <!-- Product Selection -->
                    <v-card-title>Product Selection</v-card-title>
                    <v-form ref="productForm">
                        <v-select v-model="selectedProduct" :items="products" item-text="name" item-value="id"
                            label="Select Product"></v-select>
                        <v-btn @click="addProductToBill">Add Product</v-btn>
                    </v-form>

                    <!-- Service Selection -->
                    <v-card-title>Service Selection</v-card-title>
                    <v-form ref="serviceForm">
                        <v-select v-model="selectedService" :items="services" item-text="name" item-value="id"
                            label="Select Service"></v-select>
                        <v-btn @click="addServiceToBill">Add Service</v-btn>
                    </v-form>
                </v-card>
            </v-col>

            <!-- Main Section - Display and Manage Bill Details -->
            <!-- ... -->
            
        </v-row>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            customer: {
                name: '',
                mobile: '',
                date: '',
            },
            menu: false,
            products: [
                // Add your product objects here
            ],
            services: [
                // Add your service objects here
            ],
            selectedProduct: null,
            selectedService: null,
            billProducts: [],
            billServices: [],
        };
    },
    methods: {
        addProductToBill() {
            if (this.selectedProduct) {
                // Logic to add selectedProduct to the bill
                this.billProducts.push(this.selectedProduct);
                this.selectedProduct = null;
                // Update the bill details display accordingly
                console.log('Product added to the bill:', this.selectedProduct);
            }
        },
        addServiceToBill() {
            if (this.selectedService) {
                // Logic to add selectedService to the bill
                this.billServices.push(this.selectedService);
                this.selectedService = null;
                // Update the bill details display accordingly
                console.log('Service added to the bill:', this.selectedService);
            }
        },
    },
};
</script>
  