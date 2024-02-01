<template>
    <div class="fill-height">
        <!-- User List -->
        <v-card class="fill-height">
            <div class="d-flex align-center justify-space-between w-100 mt-4">
                <v-card-title>User Management</v-card-title>
                <v-btn color="primary" class="ma-4" @click="addUserDialog">Add New User</v-btn>
            </div>
            <v-card-text>
                <v-data-table class="border rounded-lg" :headers="headers" :items="users" item-key="id">
                    <!-- <template v-slot:[`item.name`]="{item}">
                        <v-chip>{{ item.name }}</v-chip>
                    </template>
                    <template v-slot:[`item.email`]="{item}">
                        <v-chip>{{ item.email }}</v-chip>
                    </template> -->
                    <template v-slot:[`item.role`]="{item}">
                        <v-chip>{{ item.role }}</v-chip>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon @click="editUser(item)">mdi-pencil</v-icon>
                        <v-icon class="ml-5" @click="deleteUser(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!-- User Form Dialog for Edit and Add -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>{{ editMode ? 'Edit User' : 'Add User' }}</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveUser">
                        <!-- Input fields for user details -->
                        <v-text-field v-model="editedUser.name" label="Name" type="text"></v-text-field>
                        <v-text-field v-model="editedUser.email" label="Email" type="email"></v-text-field>
                        <v-text-field v-model="editedUser.phone_number" maxlength="10" label="Phone Number"></v-text-field>
                        <v-select v-model="editedUser.role" :items="roles" label="Role"></v-select>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="dialog = false">Cancel</v-btn>
                            <v-btn color="primary" type="submit">Save</v-btn>
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
            users: [], // Placeholder for fetched users
            editedUser: {
                id: null,
                name: '',
                email: '',
                phone_number: '',
                role: '',
            },
            roles: ['Admin', 'User'], // Placeholder for roles
            headers: [
                { title: 'Name', value: 'name' },
                { title: 'Email', value: 'email' },
                { title: 'Phone Number', value: 'phone_number' },
                { title: 'Role', value: 'role' },
                { title: 'Actions', value: 'actions', sortable: false },
            ],
        };
    },
    methods: {
        editUser(user) {
            this.editMode = true;
            this.editedUser = { ...user };
            this.dialog = true;
        },
        addUserDialog(){
            this.editMode = false;
            this.editedUser = {
                id: null,
                name: '',
                email: '',
                phone_number: '',
                role: '',
            };
            this.dialog = true;
        },
        async deleteUser(user) {
            try {
                const res = await this.axios.delete(`/admin/users/${user.id}`);

                if(res){
                    console.log('User Deleted.');
                }else{
                    console.log('User deletion failed.');
                }
                this.fetchUsers();
            } catch (error) {
                console.error(error);
            }
        },
        async saveUser() {
            try {
                const formData = {...this.editedUser};
                if (!this.editMode) {
                    // Implement edit user functionality using API call
                    const res = await this.axios.post(`/admin/users`, formData);
                    // Update users list after successful update
                    if(res.status == 200){
                        this.fetchUsers();
                    }
                } else {
                    // Implement add user functionality using API call
                    const res = await this.axios.put(`/admin/users/${formData.id}`,formData);
                    // Update users list after successful addition
                    if(res.status == 200){
                        this.fetchUsers();
                    }
                }
                this.dialog = false;
                this.fetchUsers();
                
            } catch (error) {
                console.error(error);
            }
        },
        async fetchUsers() {
            // Implement fetching users from API and update 'users' data
            try {
                const res = await this.axios.get(`/admin/users`);

                if(res){
                    console.log(res);
                    this.users = res.data;
                }else{
                    console.log('User fetch failed.');
                }
            } catch (error) {
                console.error(error)
            }
        },
    },
    created() {
        // Fetch users when the component is created
        this.fetchUsers();
    },
};
</script>
  
<style>
/* Add custom styles if needed */
</style>
  