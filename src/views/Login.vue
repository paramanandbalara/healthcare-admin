<template>
    <v-container class="fill-height login-container flex-column">
        <v-card width="500px" class="text-center pa-5">
            <div class="d-flex bg-brown-lighten-2 rounded">
                <v-img src="@/assets/images/logo.png" height="150"></v-img>
            </div>
            <div class="w-100" v-if="!otpSent">
                <h2 class="mb-4 font-weight-regular my-2">Login</h2>
                <v-text-field variant="solo" class="w-auto" v-model="phone_number" label="Enter your phone number" maxlength="10"></v-text-field>
                <v-btn class="w-100" color="green" @click="requestOTP">Request OTP</v-btn>
            </div>
            <div v-else>
                <div class="otp-container flex-column">
                    <h2 class="mb-4">Enter OTP</h2>
                    <v-otp-input autofocus v-model="otp"></v-otp-input>
                </div>
                <v-btn class="w-100" color="green" @click="verifyOTP">Verify OTP</v-btn>
            </div>
            <!-- <v-btn class="my-4" variant="flat" to="/register">Register</v-btn> -->
        </v-card>
    </v-container>
</template>

<script>
import { useAppStore } from '@/store/app';

export default {
    name: 'Login',
    data() {
        return {
            phone_number: '',
            // otp: Array(6).fill(''),
            otp:'',
            otpSent: false,
            otpToken: null
        };
    },
    methods: {
        async requestOTP() {
            try {
                if (!Number(this.phone_number)) { 
                    alert("Please enter your phone number in a valid format") 
                    return
                }
                if (this.phone_number.length !== 10) { 
                    alert("Phone number should be 10 digits") 
                    return
                }
                const response = await this.axios.post('/login/initiate', { phone_number: this.phone_number });
                if (response) {
                    this.otpSent = true;
                }
            } catch (error) {
                console.error('Error requesting OTP:', error);
            }
        },
        async verifyOTP() {
            try {
                // Simulated response, replace this with your actual API call
                const response = await this.axios.post('/login', { phone_number: this.phone_number, otp: this.otp });

                if (response) {
                    alert('Logged in successfully!');
                    // Saving response data to Pinia store
                    const store = useAppStore(); // Use your specific store here
                    store.setLoginData(response.data.user); // Replace with your store method to save login data
                    this.$router.push('/users');
                } else {
                    alert('Invalid OTP. Try again.');
                }
            } catch (error) {
                console.error('Error verifying OTP:', error);
            }
        },

        handleOtpInput(index) {
            const nextIndex = index;
            if (nextIndex < 6) {
                this.$refs.otpBox[nextIndex].focus();
            }
        },
        handleOtpKeydown(index, event) {
            if (event.key === "Backspace" && this.otp[index - 1] === "" && index > 1) {
                this.$refs.otpBox[index - 2].focus();
            }
        }
    }
};
</script>
<style scoped>
</style>