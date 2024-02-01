<template>
    <v-container class="fill-height login-container flex-column">
        <v-card width="500px" class="text-center pa-5">
            <div class="w-100" v-if="!otpSent">
                <h2 class="mb-4">Register</h2>
                <v-text-field variant="solo" class="w-auto" v-model="name" label="Enter your Name" type="text"></v-text-field>
                <v-text-field variant="solo" class="w-auto" v-model="email" label="Enter your email" type="email"></v-text-field>
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
            <v-btn class="my-4" variant="flat" to="/login">Go to login</v-btn>
        </v-card>
    </v-container>
</template>

<script>

export default {
    name: 'RegisterationPage',
    data() {
        return {
            name: '',
            email: '',
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
                if (!this.name) { 
                    alert("Please enter your name.") 
                    return
                }
                if (!Number(this.phone_number)) { 
                    alert("Please enter your phone number in a valid format") 
                    return
                }
                if (this.phone_number.length !== 10) { 
                    alert("Phone number should be 10 digits") 
                    return
                }
                const response = await this.axios.post('/register', { name: this.name, email: this.email, phone_number: this.phone_number });
                
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
                const response = await this.axios.post('/verify', { phone_number: this.phone_number, otp: this.otp });

                if (response) {
                    alert('Registered successfully!');

                    // Saving response data to Pinia store
                    this.$router.push('/login');
                    // const store = useAppStore(); // Use your specific store here
                    // store.setLoginData(response); // Replace with your store method to save login data
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