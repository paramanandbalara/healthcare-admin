<template>
    <div class="animation-container">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo-animation" />
    </div>
</template>

<script>
export default {
    name: 'AnimationPage',
    mounted() {
        setTimeout(() => {
            this.$router.push('/'); // navigate to home page after 2 seconds
        }, 3000);
    }
}
</script>

<style scoped>
.animation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #2c3e50, #34495e);
    overflow: hidden;
}

.logo-animation {
    opacity: 0;
    width: 60%;
    /* Set max-width for logo size */
    transition: transform 1s;
    animation: fadeIn 2s forwards, bounce 1s 1s ease-out;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-15px);
    }

    60% {
        transform: translateY(-7px);
    }
}
</style>
