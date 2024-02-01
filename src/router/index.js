// Composables
import { useAppStore } from '@/store/app';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	// {
	// 	path: '/',
	// 	component: () => import('@/layouts/default/Default.vue'),
	// 	children: [
	// 		{
	// 			path: '',
	// 			name: 'Home',
	// 			// route level code-splitting
	// 			// this generates a separate chunk (about.[hash].js) for this route
	// 			// which is lazy-loaded when the route is visited.
	// 			component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
	// 		},
	// 	],
	// },
	{
		path: '/login',
		// component: () => import('@/layouts/default/Default.vue'),
		children: [
			{
				path: '',
				name: 'Login',
				component: () => import('@/views/Login.vue')
			},
		],
	},
	{
		path: '/users',
		component: () => import('@/layouts/admin/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'UserManagement',
				component: () => import('@/views/admin/UserManagement.vue')
			},
		],
	},
	{
		path: '/products',
		component: () => import('@/layouts/admin/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'ProductManagement',
				component: () => import('@/views/admin/ProductManagement.vue')
			},
		],
	},
	{
		path: '/services',
		component: () => import('@/layouts/admin/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'ServiceManagement',
				component: () => import('@/views/admin/ServiceManagement.vue')
			},
		],
	},
	{
		path: '/service-requests',
		component: () => import('@/layouts/admin/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'ServiceRequests',
				component: () => import('@/views/admin/ServiceRequests.vue')
			},
		],
	},
	{
		path: '/orders',
		component: () => import('@/layouts/admin/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'OrderManagement',
				component: () => import('@/views/admin/OrderManagement.vue')
			},
		],
	},
	{
		path: '/billing',
		component: () => import('@/layouts/admin/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'BillingManagement',
				component: () => import('@/views/admin/BillingManagement.vue')
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});
router.beforeEach((to, from, next) => {
	const app_store = useAppStore();
	if (to.path == '/logout') {
		app_store.logout();
		next({ name: 'Login' })
	} else if(!app_store.user && to.path !== '/login') {
		next('/login')
	} else {
		next()
	}
});

export default router
