import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'


const router = createRouter({
    //history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(),
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: () => import('@/components/beta/Home.vue'),
        },
        {
            path:'/',
            redirect:'/home'
        },
        /*
        {
            path: '/',
            name: 'HomePage',
            component: () => import('@/components/alpha/HomePage.vue'),
        },
        {
            path: '/one',
            name: 'OneBusInfo',
            component: () => import('@/components/alpha/OneBusTest.vue'),
        },
        {
            path: '/image',
            name: 'Image',
            component: () => import('@/components/alpha/Image.vue'),
        },
        */
    ]
})

export default router
