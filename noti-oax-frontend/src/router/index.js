import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CrearNoticiaView from '../views/CrearNoticiaView.vue'
import DetalleNoticiaView from '../views/DetalleNoticiaView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/crear', component: CrearNoticiaView, meta: { requiereAuth: true } },
  { path: '/noticia/:id', component: DetalleNoticiaView }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiereAuth && !token) next('/login')
  else next()
})

export default router