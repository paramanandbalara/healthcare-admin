<template>
	<v-app-bar app color="primary" class="w-100 pr-md-15">
		<slot></slot>

	</v-app-bar>
</template>

<script>
import { useAppStore } from '@/store/app';

export default {
	data() {
		return {
			showNav: false,
			on: false,
			isWideScreen: window.innerWidth > 768,
			// links: [
			// 	{ to: '/', text: 'Home' },
			// 	{ to: '/services', text: 'Services' },
			// 	{ to: '/products', text: 'Products' },
			// 	{ to: this.store.isLoggedIn.value ? '/profile' : '/login', text: store.isLoggedIn.value ? 'Profile' : 'Login' },
			// ],
		};
	},
	computed: {
		isLoggedIn() {
			return !!this.store.user;
		},
		menuIcon() {
			return this.showNav ? '✕' : '☰';
		},
		cartItems() {
			// Placeholder, you should return the number of items in the cart from your store/state
			return 1;  // Assuming there are 5 items in the cart as a placeholder
		},
		store(){
			return useAppStore()
		},
		links(){
			const login_routes = [
				{ to: '/', text: 'Home' },
				{ to: '/services', text: 'Services' },
				{ to: '/products', text: 'Products' },
				{ to: this.store.isLoggedIn.value ? '/profile' : '/login', text: this.store.isLoggedIn.value ? 'Profile' : 'Login' },
			]
			return login_routes
		}
	},
	created() {
		window.addEventListener('resize', this.checkWidth);
	},
	unmounted() {
		window.removeEventListener('resize', this.checkWidth);
	},
	methods: {
		checkWidth() {
			this.isWideScreen = window.innerWidth > 768;
			if (this.isWideScreen) this.showNav = false;
		},
		closeNav() {
			if (!this.isWideScreen) {
				this.showNav = false;
			}
		},
		goToCart() {
			if (this.isLoggedIn) {
				this.$router.push('/cart');
			} else {
				alert('Please login first.')
				useAppStore().originatingPage.value = '/cart';
				this.$router.push('/login');
			}
		}
	}
}
</script>
