<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="d-flex align-end justify-space-between my-5">
                    <h2 class="text-center text-h4">Products</h2>
                    <v-btn-toggle class="w-auto" v-model="category" divided variant="outlined" color="brown-lighten-3">
                        <v-btn value="0">Cosmetic Products</v-btn>
                        <v-btn value="1">Medical Products</v-btn>
                    </v-btn-toggle>
                </div>
            </v-col>
        </v-row>

        <v-divider class="mb-5"></v-divider>

        <v-row class="my-1">
            <v-col v-for="product in products" :key="product.id" cols="12" md="3">
                <v-card flat class="h-100">
                    <v-badge color="red" class="ml-5" :content="`${product.discount}%OFF`" overlap>
                    </v-badge>
                    <router-link :to="{ name: 'ProductDetails', params: { id: product.id } }" class="text-decoration-none">
                        <v-img :src="`data:image/jpeg;base64,${product.thumbnail}`" class="px-4 mt-4 rounded"
                            style="height:100%;max-height:200px;width:100%;object-fit: cover;" />
                            <v-card-title class="text-black mb-0 text-body-1 pb-0 font-weight-regular">{{ product.product_name }}</v-card-title>
                            <v-card-subtitle class="text-medium-emphasis">Mkt: {{ product.manufacturer
                            }}</v-card-subtitle>
                            <v-card-text class="pt-1">
                            <span class="font-weight-medium text-body-2 text-black">₹ {{ product.price * ((100 -
                                product.discount) / 100) }}</span>
                            <span class="text-body-2 text-decoration-line-through ml-2 text-red-darken-2">₹{{ product.price
                            }}</span>
                            </v-card-text>
                    </router-link>
                    <div class="py-2">
                        <v-btn class="w-100" @click="addToCart(product.id)" color="success">ADD TO CART</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { useAppStore } from '@/store/app';

export default {
    data() {
        return {
            category: 0,
            products: [] // Initialize products as an empty array
        };
    },
    created() {
        this.fetchProducts(); // Fetch products when the component is created
    },
    watch:{
        category(){
            this.fetchProducts();
        }
    },
    computed:{

        store() {
            return useAppStore()
        },
        user_id(){
            return this.store.user.id
        }
    },
    methods: {
        async fetchProducts() {
            try {
                // Make an API call to fetch products from the backend
                const res = await this.axios.get(`/product/category/${this.category}`);
                // if (res.data) {
                this.products = res.data; // Update products with fetched data
                // }

            } catch (error) {
                console.error(error)
            }
        },
        async addToCart(productId) {
            try {
                if(!this.user_id){
                    this.$router.push('/login');
                    return
                }
                const formData = {
                    productId:productId,
                    userId:this.user_id,
                    quantity:1
                }
                // Make an API call to add the selected product to the cart
                const res = await this.axios.post(`/cart/add`, formData);
                console.log(res);
                console.log(`Added product with ID ${productId} to cart.`);

            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        }
    }
}
</script>
  
<style scoped>
/* Add custom styles if needed */
</style>
  