<template>
    <div class="fill-height">
        <v-card class="fill-height">
            <div class="d-flex align-center justify-space-between w-100 mt-4">
                <v-card-title>Service Requests</v-card-title>
            </div>
            <v-card-text>
                <v-data-table class="border rounded-lg" :headers="headers" :items="serviceRequests" item-key="id">
                    <template v-slot:[`item.status`]="{ item }">
                        <span :class="{'text-blue-darken-2':statusOptions.find(e=>e.value == item.status).title=='Pending','text-green-darken-2':statusOptions.find(e=>e.value == item.status).title=='Completed','text-red-darken-2':statusOptions.find(e=>e.value == item.status).title=='Cancelled'}">{{ statusOptions.find(e=>e.value == item.status).title }}</span>
                    </template>
                    <template v-slot:[`item.created`]="{ item }">
                        <span>{{ new Date(item.created).toLocaleDateString() }}</span>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn variant="text" @click="openDialog(item)" text>View Details</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialog" max-width="800">
            <v-card class="pa-lg-5">
                <v-card-title class="d-flex align-center">
                    Service Request Details
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pa-lg-5 pa-0">
                    <!-- Display detailed information here -->
                    <v-container>
                        <!-- Show details of the selected service request -->
                        <v-row v-if="selectedService">
                            <v-col cols="12" class="border rounded-lg py-5">
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Service</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.service_name }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Name</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_name }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Age</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_age }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Patient Complaints</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_complaints }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">History of Person</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_history }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Family History</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_family_history }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Phone Number</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_phone_number }}</v-card-text>
                                <v-divider class="my-2"></v-divider>
                                <v-card-subtitle class="font-weight-bold text-subtitle-1">Consultation Time</v-card-subtitle>
                                <v-card-text class="py-2">{{ selectedService.patient_consultation_time }}</v-card-text>
                            </v-col>
                            <v-col cols="12" class="border rounded-lg py-5 my-5">
                                <h3>Remarks</h3>
                                <div class="border rounded-lg py-5 my-5 overflow-y-auto" style="max-height: 400px;">
                                    <v-card flat v-for="remark,index in remarks" :key="index" v-if="remarks.length">
                                        <div class="pl-2 d-flex align-center">
                                            <v-chip outlined v-if="remark.user">{{ remark.user }}</v-chip>
                                            <v-chip outlined v-else>Homoeopatha</v-chip>
                                            <v-chip outlined class="ml-2">{{ new Date(remark.created).toLocaleDateString() }} {{ new Date(remark.created).toLocaleTimeString() }}</v-chip>
                                        </div>
                                        <v-card-text>{{ remark.remark }}</v-card-text>
                                    </v-card>
                                    <v-card-text v-else>No remarks</v-card-text>
                                </div>
                                <v-textarea v-model="new_remark" placeholder="Remark" variant="outlined"></v-textarea>
                                <v-btn @click="addRemark()" color="primary">Add Remark</v-btn>
                            </v-col>
                            <v-col cols="12">
                                <v-select variant="outlined" label="Status" v-model="selectedService.status"
                                    :items="statusOptions"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-btn @click="updateStatus(selectedService)" color="primary">Update Status</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            headers: [
                { title: 'Service Name', value: 'service_name' },
                { title: 'Customer Name', value: 'patient_name' },
                { title: 'Date', value: 'created' },
                { title: 'Phone Number', value: 'patient_phone_number' },
                { title: 'Consultation Time', value: 'patient_consultation_time' },
                { title: 'Status', value: 'status' },
                { title: 'Actions', value: 'actions', sortable: false },
            ],
            serviceRequests: [],
            remarks: [],
            dialog: false,
            selectedService: null,
            new_remark:'',
            statusOptions: [
                {
                    title:'Pending', 
                    value:1
                },
                {
                    title:'In Progress', 
                    value:2
                },
                {
                    title:'Completed',
                    value:3
                }
            ],
        };
    },
    watch:{
        selectedService(){
        this.fetchServiceRemarks();
        }
    },
    created(){
        this.fetchServiceRequests();
    },
    methods: {
        openDialog(service) {
            this.selectedService = { ...service };
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
            this.selectedService = null;
        },
        updateStatus(service) {
            // Simulate updating status (You'd perform an API call here)
            console.log(`Updating status of service request ID ${service.id} to: ${service.status}`);
            // Close the dialog after updating
            this.closeDialog();
        },
        async fetchServiceRemarks() {
            // Implement fetching products from API and update 'products' data
            try {
                const res = await this.axios.get(`/service-request/remarks?sr=${this.selectedService.id}`);
                this.remarks = res.data;
            } catch (error) {
                console.error(error)
            }
        },
        async addRemark() {
            // Implement fetching products from API and update 'products' data
            try {
                const formData = {
                    status:this.selectedService.status,
                    service_request_id:this.selectedService.id,
                    remark:this.new_remark
                }
                const res = await this.axios.post(`/service-request/remarks`,formData);
                this.fetchServiceRemarks();
                this.new_remark = '';
            } catch (error) {
                console.error(error)
            }
        },
        async fetchServiceRequests() {
            // Implement fetching products from API and update 'products' data
            try {
                const res = await this.axios.get(`/service-request/get`);
                this.serviceRequests = res.data;
            } catch (error) {
                console.error(error)
            }
        },
    },
};
</script>
  
<style>/* Add any custom styles here */</style>
  