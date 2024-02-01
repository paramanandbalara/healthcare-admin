<template>
    <v-app>
        <admin-sidebar ref="side_bar"/>
        <admin-bar>
            <v-app-bar-nav-icon class="d-block d-md-none" variant="text" @click.stop="$refs.side_bar.drawer = !$refs.side_bar.drawer"></v-app-bar-nav-icon>
        </admin-bar>

        <admin-view />
    </v-app>
</template>
  
<script setup>
import AdminBar from './AppBar.vue'
import AdminView from './View.vue'
import AdminSidebar from './AdminSidebar.vue'
</script>
  
<style scoped>
/* .v-application{
    max-width: 100vw!important;
  } */
</style>
  