<template>
	<v-sheet class="py-5 px-lg-15 bg-grey-lighten-4 fill-height">
		<v-container fluid>
			<v-row class="justify-center">
				<!-- Cart Items Section -->
				<v-col class="px-0 pa-md-2" cols="12" md="8">
					<v-card>
						<v-row v-if="cartItems.length === 0" class="pa-5">
							<v-col>
								<p>Your cart is empty. Go grab some products!</p>
							</v-col>
						</v-row>
						<v-card v-for="item in cartItems" :key="item.id" class="rounded-0 pa-4 border-b" flat>
							<v-row class="cart-item">
								<v-col cols="5" md="2">
									<div class="h-100 d-flex align-center">
										<v-img cover class="h-100"
											:src="`data:image/jpeg;base64,${item.thumbnail}`" alt="Product Image"></v-img>
									</div>
								</v-col>
								<v-col cols="7" md="10">
									<div class="">
										<h3 class="font-weight-medium">{{ item.product_name }}</h3>
										<p class="text-medium-emphasis text-body-2">Mkt: {{ item.manufacturer }}</p>
										<p class="mt-4" v-if="item.discount == 0">₹{{ item.price * item.quantity }}</p>
										<p class="mt-4" v-else>
											<span class="text-disabled text-decoration-line-through text-body-2">
												₹{{ item.price * item.quantity }}
											</span>
											<span class="font-weight-medium text-body-1 mx-2">
												₹{{ (item.price - (item.price * item.discount / 100)) * item.quantity }}
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
											:disabled="item.quantity <= 1" density="compact" icon="mdi-minus"></v-btn>
										<span class="px-3 mx-3 rounded border">{{ item.quantity }}</span>
										<v-btn @click="increaseQuantity(item.id)" color="green" density="compact"
											icon="mdi-plus"></v-btn>
									</div>
								</v-col>
								<v-col cols="7" md="10">
									<v-btn variant="plain" class="remove-btn pa-0" @click="removeFromCart(item.id)"
										color="error">Remove</v-btn>
								</v-col>
							</v-row>
						</v-card>
					</v-card>
				</v-col>

				<!-- Addresses Section -->
				<v-col class="px-0 pa-md-2" cols="12" md="4" v-if="cartItems.length">
					<v-card class="">

						<!-- <h2 class="mb-4">Your Addresses</h2>
						<v-row v-for="address, index in addresses" :key="index">
							<v-col cols="12" class="py-0">
								<v-card class="mb-3 d-flex" @click="selectedAddress = address"
									:elevation="selectedAddress == address ? 4 : 1">
									<v-radio v-model="selectedAddress" :value="address"></v-radio>
									<v-card-text class="w-100">
										<p>{{ address }}</p>
									</v-card-text>
								</v-card>
							</v-col>
						</v-row> -->
						<!-- <v-row>
							<v-col cols="12">
								<h3 class="my-4">Add New Address</h3>
								<v-form @submit.prevent="addNewAddress">
									<v-textarea variant="solo" v-model="new_address" label="Address" required></v-textarea>
									<v-btn type="submit" color="primary" :disabled="new_address.length <= 5">Add
										Address</v-btn>
								</v-form>
							</v-col>
						</v-row> -->

						<h2 class="border-b px-5 py-3 text-h6 font-weight-medium text-medium-emphasis">Price Details</h2>
						<v-row v-if="cartItems.length > 0" class="cart-summary">
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
									<v-btn @click="proceedToCheckout" color="success" :disabled="!cartItems.length">Place Order</v-btn>
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
			cartItems: [],
			addresses: [
				// Mock data for addresses
			],
			selectedAddress: null,
			new_address: ''
		};
	},
	created() {
		if (!this.user_id) {
			this.$router.push('/login');
		} else {
			this.fetchCartItems()
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
		proceedToCheckout() {
			this.$router.push('/checkout')
		},
	},
}
</script>
  
<style scoped></style>
  