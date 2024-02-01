<template>
    <v-container>
        <h2 class="my-4 text-center">User Profile</h2>
        <v-row justify="center">
            <v-col cols="6">
                <v-card class="pa-5">
                    <v-card-title>Profile Information</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Name: {{ userProfile.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Email: {{ userProfile.email }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Mobile Number: {{ userProfile.mobile }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Address: {{ userProfile.address }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-btn @click="editProfile">Edit Profile</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" v-if="isEditing">
                <!-- Edit Profile Section -->
                <v-card class="pa-5">
                    <v-card-title class="mb-4">Edit Profile</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="updateProfile">
                            <v-text-field variant="solo" v-model="editedProfile.name" label="Name"></v-text-field>
                            <v-text-field variant="solo" v-model="editedProfile.email" label="Email"></v-text-field>
                            <v-text-field variant="solo" v-model="editedProfile.mobile" label="Mobile Number"></v-text-field>
                            <v-text-field variant="solo" v-model="editedProfile.address" label="Address"></v-text-field>
                            <v-btn class="mr-4" type="submit" color="primary">Save Changes</v-btn>
                            <v-btn @click="cancelEdit">Cancel</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            userProfile: {}, // Fetched user profile data
            editedProfile: {}, // User data being edited
            isEditing: false, // Flag to toggle edit mode
        };
    },
    created() {
        // Fetch user profile data from API and assign it to userProfile
        this.userProfile = {
            name: "John Doe",
            email: "johndoe@example.com",
            mobile: "1234567890",
            address: "123 Main St, City, Country",
            // ... Other user data
        };
        // Initially assign fetched profile data to editedProfile
        this.editedProfile = { ...this.userProfile };
    },
    methods: {
        editProfile() {
            this.isEditing = true;
        },
        updateProfile() {
            // Call API to update user profile with this.editedProfile data
            // After successful update, assign editedProfile back to userProfile
            this.userProfile = { ...this.editedProfile };
            this.isEditing = false; // Turn off edit mode
        },
        cancelEdit() {
            // Reset editedProfile data to match userProfile
            this.editedProfile = { ...this.userProfile };
            this.isEditing = false; // Turn off edit mode
        },
    },
};
</script>
  
  <!-- Add Vuetify styles -->
<style>
/* Add Vuetify-specific styling if necessary */
</style>
  