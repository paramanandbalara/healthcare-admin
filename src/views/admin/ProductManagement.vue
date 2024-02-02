<template>
    <div class="fill-height">
        <!-- Product List -->
        <v-card class="fill-height">
            <div class="d-flex align-center justify-space-between w-100 mt-4">
                <v-card-title>Product Management</v-card-title>
                <v-btn color="primary" class="ma-4" @click="openAddProductDialog">Add New Product</v-btn>
            </div>
            <v-card-text>
                <v-data-table class="border rounded-lg" :headers="headers" :items="products" item-key="id">
                    <template v-slot:[`item.thumbnail`]="{ item }">
                        <img :src="`data:image/jpeg;base64,${item.thumbnail}`" alt="Product Image" style="max-width: 100px;">
                        <!-- <img :src="loaded_thumbnails[item.id]" alt="Product Image" style="max-width: 100px;"> -->
                    </template>
                    <template v-slot:[`item.discount`]="{ item }">
                        <v-chip>{{ item.discount }}% OFF</v-chip>
                    </template>
                    <template v-slot:[`item.bestseller`]="{ item }">
                        <v-switch @click="productBestsellerToggle(item)" :true-value="1" :false-value="0" v-model="item.bestseller" color="success"></v-switch>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon @click="editProduct(item)">mdi-pencil</v-icon>
                        <v-icon class="ml-5" @click="deleteProduct(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!-- Add/Edit Product Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>{{ editMode ? 'Edit Product' : 'Add Product' }}</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveProduct">
                        <v-text-field variant="outlined" v-model="editedProduct.product_name"
                            label="Product Name"></v-text-field>
                        <v-text-field variant="outlined" v-model="editedProduct.description"
                            label="Description"></v-text-field>
                        <v-text-field variant="outlined" v-model="editedProduct.manufacturer"
                            label="Manufacturer"></v-text-field>
                        <v-select variant="outlined" :items="categories" v-model="editedProduct.category"
                            label="Category"></v-select>
                        <v-text-field variant="outlined" v-model.number="editedProduct.price"
                            label="Original Price"></v-text-field>
                        <v-text-field variant="outlined" v-model.number="editedProduct.discount"
                            label="Discount%"></v-text-field>
                        <v-text-field variant="outlined" v-model.number="editedProduct.discountedPrice" label="Price"
                            disabled></v-text-field>
                        <v-file-input variant="outlined" v-model="thumbnail" label="Thumbnail" accept=".jpg,.jpeg,.png"
                            show-size></v-file-input>
                        <v-file-input variant="outlined" v-model="imageUrl" label="Product Image" accept=".jpg,.jpeg,.png"
                            show-size multiple></v-file-input>
                        <!-- Additional Product Images -->
                        <!-- <v-row class="px-3" v-for="(image, index) in editedProduct.additionalImages" :key="index">
                            <v-text-field variant="outlined" v-model="editedProduct.additionalImages[index]"
                                label="Additional Image URL"></v-text-field>
                        </v-row>
                        <v-row class="px-3">
                            <v-btn @click="addAdditionalImage">Add Image</v-btn>
                        </v-row>
                        <v-row>
                        </v-row> -->

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn variant="tonal" @click="dialog = false">Cancel</v-btn>
                            <v-btn variant="tonal" color="primary" type="submit">Save</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            dialog: false,
            editMode: false,
            categories: [
                {
                    title:'Cosmetic Products',
                    value: 0
                },
                {
                    title:'Medical Products',
                    value: 1
                }
            ],
            products: [], // Placeholder for fetched products
            editedProduct: {
                id: null,
                product_name: '',
                description: '',
                manufacturer: '',
                price: 0,
                discountedPrice: 0,
                discount: 0,
                category: null,
                bestseller:0
                // additionalImages: [''],
            },
            thumbnail: [],
            imageUrl: [],
            headers: [
                { title: 'Product Image', value: 'thumbnail' },
                { title: 'Product Name', value: 'product_name' },
                { title: 'Category', value: 'category' },
                { title: 'Price', value: 'price' },
                { title: 'Discount', value: 'discount' },
                { title: 'Bestseller', value: 'bestseller' },
                { title: 'Actions', value: 'actions', sortable: false },
            ],
            // loaded_thumbnails:{}
        };
    },
    methods: {
        openAddProductDialog() {
            this.editMode = false;
            this.editedProduct = {
                id: null,
                product_name: '',
                description: '',
                manufacturer: '',
                price: 0,
                discountedPrice: 0,
                discount: 0,
                category: null
                // additionalImages: [''],
            };
            this.thumbnail = [];
            this.imageUrl = [];
            this.dialog = true;
        },
        editProduct(product) {
            this.editMode = true;
            this.editedProduct = { ...product };
            this.dialog = true;
        },
        async deleteProduct(product) {
            // Implement delete product functionality using API call
            // Update products list after successful deletion
            try {
                const res = await this.axios.delete(`/product/${product.id}`);
                this.fetchProducts();
                console.log(res.data);
            } catch (error) {
                console.error(error)
            }
        },
        async productBestsellerToggle(product) {
            // Implement delete product functionality using API call
            // Update products list after successful deletion
            try {
                console.log(product?.bestseller == 0)
                let { bestseller, id:product_id } = product;
                const formData = {
                    bestseller:bestseller == 0?1:0,
                    product_id
                }
                const res = await this.axios.post(`/product/bestsellers`,formData);
                this.fetchProducts();
            } catch (error) {
                console.error(error)
            }
        },
        async saveProduct() {
            const {
                id,
            } = this.editedProduct;
            const formData = new FormData();
            await Object.keys(this.editedProduct).forEach((e) => {
                formData.append(e, this.editedProduct[e])
            })
            if (this.thumbnail.length) {
                // await formData.append('files', thumbnail, `thumbnail.${file.name.split('.').pop()}`)
                await Object.keys(this.thumbnail).forEach((index) => {
                    formData.append('files', this.thumbnail[index], `thumbnail.${this.thumbnail[index].name.split('.').pop()}`)
                })
            }
            await Object.keys(this.imageUrl).forEach((index) => {
                formData.append('files', this.imageUrl[index], `product_image-${Number(index) + 1}.${this.imageUrl[index].name.split('.').pop()}`)
            })

            if (!this.editMode) {
                // Implement edit product functionality using API call
                const res = await this.axios.post('/product', formData);
                console.log(res);
                // Update products list after successful update
                this.dialog = false;
            } else {
                const res = await this.axios.put(`/product/${id}`, formData);
                console.log(res);
                this.dialog = false;
            }
            this.fetchProducts();
        },
        async fetchProducts() {
            // Implement fetching products from API and update 'products' data
            try {
                const res = await this.axios.get('/product');
                this.products = res.data;
            } catch (error) {
                console.error(error)
            }
        },
    },
    created() {
        // Fetch products when the component is created
        this.fetchProducts();
    },
    watch: {
        'editedProduct.discount': function () {
            this.editedProduct.discountedPrice = this.editedProduct.price * ((100 - this.editedProduct.discount) / 100);
        },
    },
};
</script>
  
<style>/* Add custom styles if needed */</style>
  