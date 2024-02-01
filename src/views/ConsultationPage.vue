<template>
    <v-sheet class="py-5 px-lg-15 bg-grey-lighten-4 fill-height">
        <v-container fluid>
            <v-row class="justify-center">
                <v-col cols="12" md="8">
                    <v-card variant="flat" class="pa-5">
                        <v-card-title class="text-uppercase text-medium-emphasis border-b">Service requests</v-card-title>
                        <v-card flat v-for="request,index in service_requests">
                            <v-card-title class="text-body-1 d-flex justify-space-between">
                                <span>{{ request.service_name }}</span>
                                <span class="text-body-2 text-medium-emphasis ml-4">{{ new Date(request.created).toLocaleDateString() }}</span>
                            </v-card-title>
                            <v-card-subtitle>
                                <span class="text-body-2 font-weight-medium">Name:</span>
                                <span class="ml-5">{{ request.patient_name }}</span>
                            </v-card-subtitle>
                            <v-card-subtitle>
                                <span class="text-body-2 font-weight-medium">Complaint:</span>
                                <span class="ml-5">{{ request.patient_complaints }}</span>
                            </v-card-subtitle>
                            <div class="d-flex justify-end">
                                <v-btn variant="text" @click="selectedRequest = request">View</v-btn>
                            </div>
                        </v-card>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4" v-if="!!selectedRequest">
                    <v-card variant="flat" class="pa-5">
                        <v-card-title class="text-uppercase text-medium-emphasis border-b">Request Details</v-card-title>
                        <v-card-subtitle class="d-flex justify-space-between mt-2 mb-1">
                            <span class="text-body-2 font-weight-medium">Name:</span>
                            <span class="ml-5">{{ selectedRequest.patient_name }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="d-flex justify-space-between mb-1">
                            <span class="text-body-2 font-weight-medium">Age:</span>
                            <span class="ml-5">{{ selectedRequest.patient_age }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="d-flex justify-space-between mb-1">
                            <span class="text-body-2 font-weight-medium">Sex:</span>
                            <span class="ml-5">{{ selectedRequest.patient_sex }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="d-flex justify-space-between mb-1">
                            <span class="text-body-2 font-weight-medium">History:</span>
                            <span class="ml-5">{{ selectedRequest.patient_history }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="d-flex justify-space-between mb-1">
                            <span class="text-body-2 font-weight-medium">Family History:</span>
                            <span class="ml-5">{{ selectedRequest.patient_family_history }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle class="d-flex justify-space-between mb-1">
                            <span class="text-body-2 font-weight-medium">Phone Number:</span>
                            <span class="ml-5">{{ selectedRequest.patient_phone_number }}</span>
                        </v-card-subtitle>
                        <v-card-subtitle>
                            <span class="text-body-2 font-weight-medium">Remarks:</span>
                            <!-- <span class="ml-5">{{ selectedRequest.patient_phone_number }}</span> -->
                        </v-card-subtitle>
                        <div class="overflow-y-auto py-2" style="max-height: 250px;">
                            <div class="px-2 border-b py-2" v-for="remark,index in service_request_remarks" :key="index">
                                <div class="d-flex">
                                    <v-card-subtitle>
                                        <span class="font-weight-medium" v-if="!remark.user">Homoeopatha</span>
                                        <span class="font-weight-medium" v-else>
                                            {{ remark.user }}
                                        </span>
                                        <span class="ml-2">{{ new Date(remark.created).toLocaleDateString() }}</span>
                                        <span class="ml-2">{{ new Date(remark.created).toLocaleTimeString() }}</span>
                                    </v-card-subtitle>
                                </div>
                                <v-card-subtitle class="text-black">
                                    <span>
                                        {{ remark.remark }}
                                    </span>
                                </v-card-subtitle>
                            </div>
                        </div>
                        <v-text-field variant="outlined" class="my-5" v-model="new_remark" placeholder="Your Remark"></v-text-field>
                        <v-btn variant="text" @click="addRemark">Add Remark</v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script>
import { useAppStore } from '@/store/app';

export default {
    name:'ConsultationPage',
    data(){
        return{
            service_requests:[],
            selectedRequest:null,
            service_request_remarks:[],
            new_remark:'',
        }
    },
    created(){
        this.fetchServiceRequests();
    },
    computed: {
        store() {
            return useAppStore()
        },
        user_id() {
            return this.store.user.id
        }
    },
    watch:{
        selectedRequest(){
            this.fetchServiceRequestRemarks();
        }
    },
    methods:{
        async fetchServiceRequests(){
            try {
                const res = await this.axios.get(`/service-request/list?userId=${this.user_id}`);
                this.service_requests = res.data;
            } catch (error) {
                console.error(error)
            }
        },
        async fetchServiceRequestRemarks(){
            try {
                const res = await this.axios.get(`/service-request/remarks?sr=${this.selectedRequest.id}`);
                this.service_request_remarks = res.data;
            } catch (error) {
                console.error(error)
            }
        },

        async addRemark() {
            // Implement fetching products from API and update 'products' data
            try {
                const formData = {
                    // status:this.selectedService.status,
                    user_id:this.user_id,
                    service_request_id:this.selectedRequest.id,
                    remark:this.new_remark
                }
                const res = await this.axios.post(`/service-request/remarks`,formData);
                this.fetchServiceRequestRemarks();
                this.new_remark = '';
                console.log(res.data,'remark')
            } catch (error) {
                console.error(error)
            }
        },
    }
}
</script>