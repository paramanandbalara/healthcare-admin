<template>
    <v-navigation-drawer :permanent="!isMobile" v-model="drawer" color="primary">

        <template v-slot:prepend>

            <v-list>

                <v-list-item prepend-avatar="@/assets/images/logo.jpeg" title="Homoeopatha"></v-list-item>

            </v-list>

            <v-divider></v-divider>

        </template>


        <v-list density="compact" nav>

            <v-list-item v-for="item, index in sidebar_options" :key="index" :to="item.to" :prepend-icon="item.icon"
                :title="item.title" :value="item.value"></v-list-item>
            <!-- <v-list-group v-for="item, index in sidebar_options" :key="index" :value="item.value" >
                <template v-slot:activator="{ props }">
                    <v-list-item :prepend-icon="item.icon" v-bind="props" :title="item.title" :value="item.value"
                        ></v-list-item>
                </template>


                
            </v-list-group>
            <v-list-item v-for="status, indx in option_list" :key="indx" :append-icon="status.icon" :title="status.title" :active="$route.fullPath == `${item.to}#${status.value}`"
                    :to="{path:item.to ,hash: !!status.to?`#${status.to}`:''}"></v-list-item>

            <v-list-item prepend-icon="mdi-table-arrow-right" title="Export" @click="$refs.team_report.dialog = true"></v-list-item> -->

        </v-list>

        <template v-slot:append>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-logout-variant" title="Logout"
                    @click="app_store.logout(), $router.push('/login')"></v-list-item>
            </v-list>

        </template>

    </v-navigation-drawer>
</template>

<script>
import { useAppStore } from '@/store/app';
export default {
    data() {
        return {
            app_store: useAppStore(),
            drawer: false,
            sidebar_options: [
                {
                    title: 'Users',
                    value: 'users',
                    to: 'users',
                    icon: 'mdi-account-multiple'
                },
                {
                    title: 'Products',
                    value: 'products',
                    to: 'products',
                    icon: 'mdi-package-variant-closed'
                },
                {
                    title: 'Services',
                    value: 'services',
                    to: 'services',
                    icon: 'mdi-face-agent'
                },
                {
                    title: 'Service Requests',
                    value: 'service-requests',
                    to: 'service-requests',
                    icon: 'mdi-frequently-asked-questions'
                },
                {
                    title: 'Orders',
                    value: 'orders',
                    to: 'orders',
                    icon: 'mdi-order-numeric-ascending'
                },
                {
                    title: 'ADs',
                    value: 'ads',
                    to: 'ads',
                    icon: 'mdi-advertisements'
                },
                {
                    title: 'Billing',
                    value: 'billing',
                    to: 'billing',
                    icon: 'mdi-receipt-text-outline'
                },
            ],
        }
    },
    computed: {
        isMobile() {
            return this.$vuetify.display.mobile
        }
    },
    created() {
        if (!this.isMobile) {
            this.drawer = true
        }
    }
}
</script>