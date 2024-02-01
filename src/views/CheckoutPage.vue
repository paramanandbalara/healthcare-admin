<template>
    <v-sheet class="py-5 px-lg-15 bg-grey-lighten-4 fill-height">
        <v-container fluid class="checkout-container">
            <!-- Address and Cart Details Section -->
            <!-- Customer Information Section -->
            <v-row class="justify-center">
                <v-col class="pa-0 pa-md-2" cols="12" md="8">
                    <v-form @submit.prevent>
                        <v-expansion-panels v-model="panel">
                            <v-expansion-panel>
                                <v-expansion-panel-title class="font-weight-medium text-body-1 text-uppercase text-medium-emphasis">Address
                                    Details</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <v-card-title class="px-0 text-body-2 text-uppercase text-medium-emphasis">Saved Address</v-card-title>
                                        <v-btn variant="text" color="green-darken-2"
                                            v-if="!!selectedAddress && !edit_address" @click="editAddress">Edit</v-btn>
                                        <v-btn variant="text" color="red-darken-2" v-if="!!edit_address"
                                            @click="cancelEdit">cancel</v-btn>
                                    </div>
                                    <v-card-subtitle class="mb-4" v-if="!fetchedAddresses.length">No saved
                                        address.</v-card-subtitle>
                                    <v-row class="my-1" v-else v-for="address, index in fetchedAddresses" :key="index">
                                        <v-col cols="12" class="py-0">
                                            <v-card class="mb-3 d-flex align-center" @click="selectedAddress = address"
                                                :elevation="selectedAddress == address ? 4 : 1">
                                                <v-radio v-model="selectedAddress" color="green-darken-2"
                                                    :value="address"></v-radio>
                                                <v-card-text class="w-100">
                                                    <p>
                                                        <span class="font-weight-bold">
                                                            {{ address.customer_name }}
                                                        </span>
                                                        <span class="ml-2 font-weight-bold">
                                                            {{ address.customer_phone }}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span>{{ address.customer_address }}, </span>
                                                        <span>{{ address.customer_city }}, </span>
                                                        <span>{{ address.customer_state }}, </span>
                                                        <span class="font-weight-bold">{{ address.customer_pincode }}</span>
                                                    </p>
                                                </v-card-text>
                                                <v-icon icon="mdi-check" color="green-darken-2 mr-2"
                                                    v-if="selectedAddress == address"></v-icon>
                                            </v-card>
                                        </v-col>
                                    </v-row>

                                    <v-expansion-panels v-model="add_address_panel">

                                        <v-expansion-panel>
                                            <v-expansion-panel-title
                                                class="font-weight-medium text-body-2 text-uppercase text-medium-emphasis">Add New
                                                Address</v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <v-form ref="customer_details_form" @submit.prevent="addNewAddress">
                                                    <v-row class="my-1">
                                                        <v-col cols="12" md="6">
                                                            <v-text-field variant="outlined"
                                                                v-model="new_address.customer_name"
                                                                :rules="[e => e.length >= 3 ? true : 'Required field.']"
                                                                label="Name" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-text-field variant="outlined"
                                                                v-model="new_address.customer_phone"
                                                                :rules="[e => e.length >= 10 ? true : 'Required field.']"
                                                                maxlength="10" label="Mobile Number"
                                                                required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-text-field variant="outlined"
                                                                v-model="new_address.customer_email"
                                                                label="Email"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-text-field variant="outlined"
                                                                :rules="[e => e.length >= 6 ? true : 'Required field.']"
                                                                maxlength="6" v-model="new_address.customer_pincode"
                                                                label="Pincode"></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field variant="outlined"
                                                                :rules="[e => e.length >= 3 ? true : 'Required field.']"
                                                                v-model="new_address.customer_address" label="Address"
                                                                required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-text-field
                                                                :rules="[e => e.length >= 3 ? true : 'Required field.']"
                                                                variant="outlined" v-model="new_address.customer_city"
                                                                label="City" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-text-field
                                                                :rules="[e => e.length >= 3 ? true : 'Required field.']"
                                                                variant="outlined" v-model="new_address.customer_state"
                                                                label="State" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-btn type="submit" color="primary">
                                                                {{ !edit_address ? 'Add' : 'Update' }}
                                                                Address</v-btn>
                                                        </v-col>
                                                    </v-row>

                                                </v-form>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel :disabled="!selectedAddress">
                                <v-expansion-panel-title class="font-weight-medium text-body-1 text-uppercase text-medium-emphasis">
                                    Order Summary
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-row v-if="cartItems.length === 0" class="empty-cart-message">
                                        <v-col>
                                            <p>Your cart is empty. Go grab some products!</p>
                                        </v-col>
                                    </v-row>
                                    <v-card v-for="item in cartItems" :key="item.id" class="rounded-0 pa-4 border-b" flat>
                                        <v-row class="cart-item">
                                            <v-col cols="5" md="2">
                                                <div class="h-100 d-flex align-center">
                                                    <v-img style="" cover class="h-100"
                                                        :src="`data:image/jpeg;base64,${item.thumbnail}`"
                                                        alt="Product Image"></v-img>
                                                </div>
                                            </v-col>
                                            <v-col cols="7" md="10">
                                                <div class="">
                                                    <h3 class="font-weight-medium">{{ item.product_name }}</h3>
                                                    <p class="text-medium-emphasis text-body-2">Mkt: {{ item.manufacturer }}
                                                    </p>
                                                    <p class="mt-4" v-if="item.discount == 0">₹{{ item.price * item.quantity
                                                    }}</p>
                                                    <p class="mt-4" v-else>
                                                        <span
                                                            class="text-disabled text-decoration-line-through text-body-2">
                                                            ₹{{ item.price * item.quantity }}
                                                        </span>
                                                        <span class="font-weight-medium text-body-1 mx-2">
                                                            ₹{{ (item.price - (item.price * item.discount / 100)) *
                                                                item.quantity }}
                                                        </span>
                                                        <span class="text-body-2 text-green-darken-2 font-weight-medium">
                                                            {{ item.discount }}% Off
                                                        </span>
                                                    </p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="5" md="2">
                                                <div class="d-flex align-center">
                                                    <v-btn @click="decreaseQuantity(item.id)" color="red-darken-2"
                                                        :disabled="item.quantity <= 1" density="compact"
                                                        icon="mdi-minus"></v-btn>
                                                    <span class="px-3 mx-3 rounded border">{{ item.quantity }}</span>
                                                    <v-btn @click="increaseQuantity(item.id)" color="green"
                                                        density="compact" icon="mdi-plus"></v-btn>
                                                </div>
                                            </v-col>
                                            <v-col cols="7" md="10">
                                                <v-btn variant="plain" class="remove-btn pa-0"
                                                    @click="removeFromCart(item.id)" color="error">Remove</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-expansion-panel-text>

                            </v-expansion-panel>

                        </v-expansion-panels>
                    </v-form>
                </v-col>
                <v-col class="px-0 pa-md-2" cols="12" md="4" v-if="cartItems.length">
                    <v-card class="">
                        <h2 class="border-b px-5 py-3 text-body-1 text-uppercase font-weight-medium text-medium-emphasis">Price Details</h2>
                        <v-row class="cart-summary">
                            <v-col>
                                <div class="px-5 py-3">
                                    <div class="d-flex justify-space-between">
                                        <p class="my-2">Price({{ cartItems.length }} items):</p>
                                        <p class="my-2">₹{{ totalPrice }}</p>
                                    </div>
                                    <div class="d-flex justify-space-between">
                                        <p class="my-2">Discount:</p>
                                        <p class="my-2 text-green-darken-2">- ₹{{ totalDiscount }}</p>
                                    </div>
                                    <div
                                        class="d-flex justify-space-between border-dashed border-b border-t border-e-0 border-s-0 py-2 mb-5 mt-2 font-weight-medium">
                                        <p class="my-2">Total Amount:</p>
                                        <p class="my-2">₹{{ totalDiscountedPrice }}</p>
                                    </div>
                                    <v-btn @click="proceedToCheckout" color="success" :disabled="!selectedAddress">Proceed
                                        to
                                        Checkout</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

        </v-container>
    </v-sheet>
</template>
  
<script>
import { useAppStore } from '@/store/app';

export default {
    data() {
        return {
            fetchedAddresses: ['jkjdbksfd', 'sjfhgksjfkj'],
            cartItems: [],
            edit_address: false,
            accordion_number: 0,
            fetchedTotalPrice: 0,
            panel: [0],
            add_address_panel: [],
            new_address: {
                customer_name: '',
                customer_city: '',
                customer_state: '',
                customer_phone: '',
                customer_email: '',
                customer_pincode: '',
                customer_address: '',
            },
            selectedAddress: null,
        };
    },
    created() {
        if (!this.user_id) {
            this.$router.push('/login');
        } else {
            this.fetchAddress();
            this.fetchCartItems();
        }
    },
    computed: {
        totalPrice() {
            return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
        },
        totalDiscountedPrice() {
            return this.cartItems.reduce((acc, item) => acc + ((item.price - (item.price * item.discount / 100)) * item.quantity), 0).toFixed(2);
        },
        totalDiscount() {
            return this.cartItems.reduce((acc, item) => acc + ((item.price * item.discount / 100) * item.quantity), 0).toFixed(2);
        },
        store() {
            return useAppStore()
        },
        user_id() {
            return this.store.user.id
        }
    },
    methods: {
        async editAddress() {
            // Logic to place order using customer data and fetched cart details
            this.new_address = this.selectedAddress;
            this.edit_address = true;
            this.add_address_panel.push(0);
            console.log(this.selectedAddress)
        },
        async cancelEdit() {
            this.edit_address = false;
            this.new_address = {
                customer_name: '',
                customer_city: '',
                customer_state: '',
                customer_phone: '',
                customer_email: '',
                customer_pincode: '',
                customer_address: '',
            };
            this.add_address_panel.pop();
        },
        async fetchAddress() {
            // Fetch address details from API and assign to fetchedAddresses
            try {
                const res = await this.axios.get(`/address?userId=${this.user_id}`);
                this.fetchedAddresses = res.data;
            } catch (error) {
                console.error(error)
            }
        },
        async fetchCartItems() {
            try {
                // Make an API call to fetch products from the backend
                const res = await this.axios.get(`/cart?userId=${this.user_id}`);
                // if (res.data) {
                this.cartItems = res.data; // Update products with fetched data
                // }

            } catch (error) {
                console.error(error)
            }
        },
        async increaseQuantity(productId) {
            try {
                const item = await this.cartItems.find(i => i.id === productId);
                const formData = {
                    userId: this.user_id,
                    productId: productId,
                    quantity: item.quantity + 1
                }
                // Make an API call to fetch products from the backend
                await this.axios.put(`/cart/update`, formData);
                this.fetchCartItems();

            } catch (error) {
                console.error(error)
            }
        },
        async decreaseQuantity(productId) {
            try {
                const item = await this.cartItems.find(i => i.id === productId);
                const formData = {
                    userId: this.user_id,
                    productId: productId,
                    quantity: item.quantity - 1
                }
                // Make an API call to fetch products from the backend
                await this.axios.put(`/cart/update`, formData);
                this.fetchCartItems();

            } catch (error) {
                console.error(error)
            }
        },
        async removeFromCart(productId) {
            try {
                await this.axios.delete(`/cart/remove?userId=${this.user_id}&productId=${productId}`);
                this.fetchCartItems();
            } catch (error) {
                console.error(error)
            }
        },
        async addNewAddress() {
            try {
                const { valid } = await this.$refs.customer_details_form.validate();
                if (!valid) {
                    console.error('Please fill the forms');
                    return
                }
                if (!this.edit_address) {
                    const formData = {
                        user_id: this.user_id,
                        ...this.new_address
                    }
                    const res = await this.axios.post(`/address`, formData);
                    console.log(res.data);
                } else {
                    const formData = {
                        ...this.new_address
                    }
                    const res = await this.axios.put(`/address`, formData);
                    console.log(res.data);
                }
                this.fetchAddress();
                this.new_address = {
                    customer_name: '',
                    customer_city: '',
                    customer_state: '',
                    customer_phone: '',
                    customer_email: '',
                    customer_pincode: '',
                    customer_address: '',
                };
                this.add_address_panel.pop();

            } catch (error) {
                console.error(error)
            }
        },
        async proceedToCheckout() {
            try {
                if(!this.selectedAddress){
                    alert('Select an address first.');
                    return
                }
                const formData = {
                    userId:this.user_id,
                    customer_details_id:this.selectedAddress.id
                }
                const res = await this.axios.post(`/order/create`,formData);
                console.log(res.data);
                this.$router.push('/orders')
                // this.fetchAddresses();

            } catch (error) {
                console.error(error)
            }
        },
    }
}
</script>
  
<style scoped>
.checkout-container {
    font-family: Arial, sans-serif;
    background-color: transparent;
}

h1 {
    color: #333;
    margin-bottom: 20px;
}</style>
  