<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="d-flex align-end justify-space-between my-5">
                    <h2 class="text-center text-h4">Consult Us.</h2>
                </div>
            </v-col>
        </v-row>
        <v-divider class="mb-10"></v-divider>
        <v-row>
            <v-col cols="12" sm="6">
                <v-card flat>
                    <v-img :src="`data:image/jpeg;base64,${service.thumbnail}`" height="200px" cover></v-img>
                    <v-card-title>{{ service.service_name }}</v-card-title>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6">
                <v-form @submit.prevent="submitForm">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="formData.patient_name" label="Name"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="formData.patient_age" label="Age" required
                                type="number"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select variant="outlined" v-model="formData.patient_sex" label="Sex" :items="sexOptions"
                                required></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" v-model="formData.patient_complaints" label="Complaints"
                                required></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" v-model="formData.patient_history" label="History of Person"
                                required></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" v-model="formData.patient_family_history" label="Family History"
                                required></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="formData.patient_phone_number" maxlength="10" label="Phone Number"
                                required type="tel"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select variant="outlined" v-model="formData.patient_consultation_time" label="Consultation Time"
                                :items="consultationTimeSlots" required></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-btn type="submit" color="primary">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-form>

            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { useAppStore } from '@/store/app';

export default {
    data() {
        return {
            service: {}, // Replace with actual service title
            formData: {
                patient_name: '',
                patient_age: null,
                patient_sex: '',
                patient_complaints: '',
                patient_history: '',
                patient_family_history: '',
                patient_phone_number: '',
                patient_consultation_time: '', // Consultation time slot will be selected here
            },
            consultationTimeSlots: [], // This will contain time slots from 9am to 9pm
            sexOptions: ['Male', 'Female', 'Other'],
        };
    },
    computed: {
        serviceId() {
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
    created() {
        this.fetchServiceDetails();
        this.generateConsultationTimeSlots();
    },
    methods: {
        generateConsultationTimeSlots() {
            // Generating time slots from 9am to 9pm in 3-hour intervals
            const slots = [];
            for (let i = 9; i + 3 <= 21; i += 3) {
                slots.push(`${i}:00 - ${i + 3}:00`);
            }
            this.consultationTimeSlots = slots;
        },
        async fetchServiceDetails() {
            // Implement fetching products from API and update 'products' data
            try {
                const res = await this.axios.get(`/services/${this.serviceId}`);
                this.service = res.data[0];
            } catch (error) {
                console.error(error)
            }
        },
        async submitForm() {
            try {
                // Send formData to the API using Axios
                const formData = {...this.formData,service_id:this.serviceId,user_id:this.user_id}
                console.log(formData)
                const response = await this.axios.post('/service-request/add', formData);
                console.log('Form submitted successfully!', response.data);
                // Reset form data after successful submission
                this.formData = {
                    patient_name: '',
                    patient_age: null,
                    patient_sex: '',
                    patient_complaints: '',
                    patient_history: '',
                    patient_family_history: '',
                    patient_phone_number: '',
                    patient_consultation_time: '',
                };
                // Redirect or perform any necessary action upon successful submission
            } catch (error) {
                console.error('Error submitting form:', error);
                // Handle errors or display error messages to the user
            }
        },
    },
};
</script>
  
<style scoped>
/* Styles for the form container */
/* Include Vuetify styles as needed */</style>
  