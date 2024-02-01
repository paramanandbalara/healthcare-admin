<template>
    <div class="product-details pt-5">
        <v-row>
            <v-col cols="12" lg="6">

                <!-- Fixed Section on the Left -->
                <v-card class="fixed-section" elevation="0">
                    <v-carousel v-model="slideIndex" hide-delimiter-background>
                        <v-carousel-item v-for="(image, index) in product.images" :key="index">
                            <v-img :src="`data:image/jpeg;base64,${image.data}`" :alt="image.name"></v-img>
                        </v-carousel-item>
                    </v-carousel>
                    <v-card-actions class="d-flex justify-center">
                        <v-btn color="brown-lighten-1" variant="elevated" @click="addToCart">Add to Cart</v-btn>
                        <!-- <v-btn color="green-lighten-1" variant="elevated">Buy Now</v-btn> -->
                    </v-card-actions>
                </v-card>

            </v-col>

            <v-col cols="12" lg="6">

                <!-- Scrollable Section on the Right -->
                <v-card class="scrollable-section pa-5" elevation="0">
                    <!-- Product Details -->
                    <div class="product-info">
                        <h1 class="font-weight-medium text-h5 mb-2">{{ product.product_name }}</h1>
                        <v-btn class="font-weight-medium mb-4" color="green" variant="elevated" rounded="lg" size="small">{{
                            Number(product.rating).toFixed(1) }} ⭐</v-btn>
                        <div class="d-flex align-end mb-4">
                            <p class="text-body-1 font-weight-medium mr-4">₹ {{ discountedPrice }}</p>
                            <p class="text-decoration-line-through text-red-darken-2">₹ {{ product.price }}</p>
                            <p class="ml-4 text-green-darken-2 font-weight-bold">{{ product.discount }}% off</p>
                        </div>
                        <v-divider></v-divider>
                        <v-row class="my-4">
                            <v-col cols="12" md="3">
                                <p class="text-medium-emphasis font-weight-medium">Description:</p>
                            </v-col>
                            <v-col cols="12" md="9">
                                <p class="text-body-1">{{ product.description }}</p>
                            </v-col>
                        </v-row>
                        <!-- <v-row class="my-4">
                            <v-col cols="12" md="3">
                                <p class="text-medium-emphasis font-weight-medium">How to use</p>
                            </v-col>
                            <v-col cols="12" md="9">
                                <p>{{ product.howToUse }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="my-4">
                            <v-col cols="12" md="3">
                                <p class="text-medium-emphasis font-weight-medium">Side Effects</p>
                            </v-col>
                            <v-col cols="12" md="9">
                                <p>{{ product.sideEffects }}</p>
                            </v-col>
                        </v-row> -->
                    </div>

                    <!-- Reviews Section -->
                    <div class="reviews">
                        <h2 class="mb-4 text-h6">Reviews</h2>
                        <v-list v-if="reviews.length > 0">
                            <v-list-item v-for="review in reviews" :key="review.id">
                                <v-list-item-content>
                                    <v-rating hover :length="5" :size="32" :model-value="review .rating" readonly active-color="yellow-darken-3" />
                                    <v-list-item-title class="font-weight-medium text-medium-emphasis">{{ review.user }}</v-list-item-title>
                                    <v-list-item-title>{{ review.review }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-btn variant="text" @click="loadMoreReviews" class="mt-4">Load More Reviews</v-btn>
                    </div>

                    <!-- Write Review (Only for those who have purchased) -->
                    <v-card flat v-if="hasPurchased" class="my-4 pa-1">
                        <h2 class="mb-4 text-h6">Write a Review</h2>
                        <v-rating hover :length="5" :size="32" :model-value="0" v-model="rating" active-color="yellow-darken-3" />
                        <v-textarea variant="outlined" v-model="newReview"></v-textarea>
                        <v-btn variant="text" @click="writeReview" class="submit-review-button">Submit Review</v-btn>
                    </v-card>

                    <!-- Q&A Section -->
                    <!-- <div class="my-4">
                        <h2 class="mb-4">Questions & Answers</h2>
                        <v-list v-if="questions.length > 0">
                            <v-list-item v-for="question in questions" :key="question.id">
                                <v-list-item-content>
                                    <v-list-item-title>{{ question.content }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-btn @click="loadMoreQuestions" class="mt-4">Load More Questions</v-btn>
                    </div> -->
                </v-card>

            </v-col>
        </v-row>
    </div>
</template>
  
<script>
import { useAppStore } from '@/store/app';

export default {
    data() {
        return {
            slideIndex: 0,
            product: {},
            newReview: '',
            reviews: [],
            rating: 0,
            // questions: [],
            hasPurchased: false,
            reviewLimit: 25,
            reviewsPage: 1,
        };
    },
    computed: {
        discountedPrice() {
            return (this.product.price * (100 - this.product.discount) / 100).toFixed(2);
        },
        discountPercentage() {
            return this.product.discount;
        },
        productId() {
            console.log(this.$route.params)
            return this.$route.params.id
        },
        store() {
            return useAppStore()
        },
        user_id(){
            return this.store.user.id
        }
    },
    mounted() {
        setInterval(this.nextSlide, 5000);
        this.fetchProduct();
        this.loadMoreReviews();
        this.fetchPurchase();
    },
    methods: {
        nextSlide() {
            this.slideIndex = (this.slideIndex + 1) % this.product.images.length;
        },
        async fetchProduct() {
            try {
                // Make an API call to fetch products from the backend
                const res = await this.axios.get(`/product/${this.productId}`);
                // if (res.data) {
                this.product = res.data; // Update products with fetched data
                // }

            } catch (error) {
                console.error(error)
            }
        },
        async fetchPurchase() {
            try {
                // Make an API call to fetch products from the backend
                const res = await this.axios.get(`/order/purchased?productId=${this.productId}&userId=${this.user_id}`);
                if(res.data.length){
                    this.hasPurchased = true;
                }

            } catch (error) {
                console.error(error)
            }
        },
        async loadMoreReviews() {
            try {
                const res = await this.axios.get(`/reviews/${this.productId}?page=${this.reviewsPage}&limit=${this.reviewLimit}`)
                console.log(res.data);
                this.reviews = res.data;
                this.reviewsPage += 1;
            } catch (error) {
                console.error(error)
            }
        },
        async writeReview() {
            try {
                const formData = {
                    product_id: this.productId,
                    user_id: this.user_id,
                    review: this.newReview,
                    rating: this.rating
                }
                // Make an API call to fetch products from the backend
                const res = await this.axios.post(`/reviews/add`, formData);
                // if (res.data) {
                this.product = res.data; // Update products with fetched data
                // }

                this.newReview = '';
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
                    productId:this.productId,
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
        // loadMoreQuestions() {
        //     this.axios.get("/api/questions", { params: { limit: this.questionLimit } })
        //         .then(response => {
        //             this.questions.push(...response.data);
        //         });
        // }
    }
}
</script>
  
<style scoped>
/* Your existing styles can be adapted or added as needed to match Vuetify components */
</style>
  