<template>
    <div class="fill-height">
        <!-- Button to Open Service Form Dialog -->
        <v-card class="fill-height">
            <div class="d-flex align-center justify-space-between w-100 mt-4">
                <v-card-title>Service Management</v-card-title>
                <v-btn @click="showServiceDialog = true" color="primary" class="ma-4">Add Service</v-btn>
            </div>
            <v-card-text>
                <!-- Service List Table -->
                <v-data-table class="border rounded-lg" :headers="headers" :items="services" item-key="id">
                    <template v-slot:[`item.thumbnail`]="{ item }">
                        <v-img :src="`data:image/jpeg;base64,${item.thumbnail}`" alt="Service Image" style="max-width: 100px;"></v-img>
                    </template>
                    <template v-slot:[`item.service_name`]="{ item }">
                        {{ item.service_name }}
                    </template>
                    <template v-slot:[`item.price`]="{ item }">
                        {{ item.price }}
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon @click="editService(item)">mdi-pencil</v-icon>
                        <v-icon class="ml-5" @click="deleteService(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!-- Service Form Dialog -->
        <v-dialog v-model="showServiceDialog" max-width="500px">
            <v-card>
                <v-card-title>{{ editMode ? 'Edit Service' : 'Add Service' }}</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveService">
                        <v-text-field variant="outlined" v-model="editedService.service_name" label="Service Name"></v-text-field>
                        <v-file-input variant="outlined" v-model="imageUrl" label="Service Thumbnail" accept=".jpg,.jpeg,.png"></v-file-input>
                        <v-text-field variant="outlined" v-model.number="editedService.price" label="Price"></v-text-field>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="clearFields">Cancel</v-btn>
                            <v-btn class="ml-2" color="primary" type="submit">Save</v-btn>
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
            services: [], // Array to store service items
            editedService: {
                id:null,
                service_name: '',
                price: 0,
            },
            imageUrl: [],
            editedServiceIndex: -1, // Index of edited service in the array
            editMode: false, // Flag to determine if in edit mode
            showServiceDialog: false, // Flag to control visibility of service form dialog
            headers: [ // Table headers
                { title: 'Service Image', value: 'thumbnail' },
                { title: 'Service Name', value: 'service_name' },
                { title: 'Price', value: 'price' },
                { title: 'Actions', value: 'actions', sortable: false },
            ],
        };
    },
    created() {
        // Fetch products when the component is created
        this.fetchServices();
    },
    methods: {
        // Method to save or update service
        async saveService() {
            
            const {
                id,
            } = this.editedService;
            const formData = new FormData();
            await Object.keys(this.editedService).forEach((e) => {
                formData.append(e, this.editedService[e])
            })
            if (this.imageUrl.length) {
                await Object.keys(this.imageUrl).forEach((index) => {
                    formData.append('files', this.imageUrl[index], `thumbnail.${this.imageUrl[index].name.split('.').pop()}`)
                })
            }

            if (!this.editMode) {
                // Implement edit product functionality using API call
                const res = await this.axios.post('/services', formData);
                console.log(res);
                // Update products list after successful update
                this.showServiceDialog = false;
            } else {
                const res = await this.axios.put(`/services/${id}`, formData);
                console.log(res);
                this.showServiceDialog = false;
            }
            this.fetchServices();
            this.clearFields();
            this.showServiceDialog = false;
        },
        async fetchServices() {
            // Implement fetching products from API and update 'products' data
            try {
                const res = await this.axios.get('/services');
                this.services = res.data;
            } catch (error) {
                console.error(error)
            }
        },
        // Method to edit a service
        editService(service) {
            this.editedService = { ...service };
            this.editedServiceIndex = this.services.findIndex((s) => s.id === service.id);
            this.editMode = true;
            this.showServiceDialog = true;
        },
        // Method to delete a service
        deleteService(serviceItem) {
            this.services = this.services.filter((service) => service.id !== serviceItem.id);
        },
        // Method to clear input fields
        clearFields() {
            this.editedService = {
                id:null,
                service_name: '',
                price: 0,
            };
            this.imageUrl = [],
            this.editMode = false;
            this.showServiceDialog = false;
        },
    },
};
</script>
  
  <!-- ... (existing styles) ... -->
  