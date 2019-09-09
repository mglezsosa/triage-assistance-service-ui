import Vue from 'vue'
import VueRouter from 'vue-router'

import FullTriageProcess from '../components/FullTriageProcess.vue'
import PartialTriageProcess from '../components/PartialTriageProcess.vue'
import PendingTriageProcess from '../components/PendingTriageProcess.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

// import { Role } from './role'
import { authenticationService } from '../_services/authentication.service'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home,
            meta: { authorize: [] }
        },
        {
            path: '/partial-triage/:id',
            component: PartialTriageProcess,
            meta: { authorize: [] },
            props: true
        },
        {
            path: '/full-triage/:id',
            component: FullTriageProcess,
            meta: { authorize: [] },
            props: true
        },
        {
            path: '/pending-triage',
            component: PendingTriageProcess,
            meta: { authorize: [] }
        },
        {
            path: '/login',
            component: Login
        },
    ]
})

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const { authorize } = to.meta
    const currentUser = authenticationService.currentUserValue

    if (authorize) {
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return next({ path: "/login", query: { returnUrl: to.path } })
        }

        // check if route is restricted by role
        if (authorize.length && !authorize.includes(currentUser.role)) {
            // role not authorised so redirect to home page
            return next({ path: "/" })
        }
    }

    next()
})

export default router