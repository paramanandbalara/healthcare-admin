<template>
  <v-container fluid class="home-container px-0">
			<!-- <v-img class="mx-auto" src="@/assets/images/logo.png" alt="HealthCare Logo" width="100"></v-img> -->
    <!-- Slideshow Section -->
    <v-carousel class="mb-5" hide-delimiter-background :interval="4000" height="240">
      <v-carousel-item v-for="(slide, index) in slideData" :key="index">
        <v-img class="h-100 mx-md-16" :src="slide.image" aspect-ratio="2.5"></v-img>
      </v-carousel-item>
    </v-carousel>

    <v-divider class="w-25 mx-auto my-5" :thickness="5"></v-divider>

    <!-- Services and Products Section -->
    <v-row class="cards-section px-5">
      <v-col cols="12" md="12">
        <h2 class="mx-auto text-h4 text-uppercase" style="width: fit-content;">we offer</h2>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat to="/services" class="text-center text-white" height="450" image="@/assets/images/service.jpg">
          <!-- <v-img height="400" cover src="@/assets/images/service.jpeg"></v-img> -->
          <v-card-title class="text-h4 mt-4">Services</v-card-title>
          <v-card-text style="text-shadow: 0px 0px 5px #000!important;">Expert consultations and treatments.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat to="/products" class="text-center text-white" height="450" image="@/assets/images/product.jpg">
          <!-- <v-img height="400" cover src="@/assets/images/product.jpeg"></v-img> -->
          <v-card-title class="text-h4 mt-4">Products</v-card-title>
          <v-card-text style="text-shadow: 0px 0px 5px #000!important;">Quality healthcare products for you.</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer Text -->
    <v-row class="footer-text px-5" justify="center">
      <v-col cols="12">
        <p class="pa-5 border rounded-lg bg-brown-lighten-3">Your health matters to us. Explore a range of services and products tailored to meet your needs. Stay fit, stay
          healthy!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      slideData: [
        { title: "Slide 1", image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/1f3a3fb326fae2bd.jpg?q=20" },
        { title: "Slide 2", image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/624f9293b94ee221.jpeg?q=20" },
        // ... Add more slides as needed
      ],
      // Other data remains the same
    };
  },
  // Methods and other lifecycle hooks remain the same
}
</script>

<style scoped>
/* Scoped styles remain mostly the same, adjust as necessary */
/* ... */
</style>
