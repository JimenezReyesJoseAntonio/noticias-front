<template>
  <main class="home">
    <section class="hero">
      <h1 class="hero__titulo">Las noticias de Oaxaca, en un solo lugar</h1>
      <p class="hero__texto">Información local, cultura y comunidad.</p>
      <button class="hero__boton hero__boton--primario">Ver noticias</button>
    </section>

    <section class="stats">
      <div class="stats__item"><strong>100+</strong><span>Noticias</span></div>
      <div class="stats__item"><strong>Oaxaca</strong><span>Local</span></div>
      <div class="stats__item"><strong>Diario</strong><span>Actualizado</span></div>
    </section>

    <section class="noticias">
      <h2 class="noticias__titulo">Últimas noticias</h2>

      <div class="filtros">
        <button
          v-for="cat in categorias"
          :key="cat"
          @click="categoriaActiva = cat"
          :class="['filtro__btn', { 'filtro__btn--activo': categoriaActiva === cat }]"
        >{{ cat }}</button>
      </div>

      <p v-if="cargando" class="noticias__cargando">Cargando...</p>
      <p v-else-if="noticiasFiltradas.length === 0">No hay noticias en esta categoría.</p>

      <div class="noticias__lista">
        <article v-for="n in noticiasFiltradas" :key="n.id_noticia || n.id" class="noticia">
          <img v-if="n.imagen" :src="getUrlImagen(n.imagen)" class="noticia__imagen" alt="" />
          <div v-else class="noticia__imagen"></div>
          <h3 class="noticia__titulo">{{ n.titulo }}</h3>
          <p class="noticia__meta">{{ n.nombre_categoria || n.categoria }} • {{ n.autor }}</p>
          <p class="noticia__resumen">{{ n.resumen }}</p>
          <router-link :to="`/noticia/${n.id_noticia || n.id}`" class="noticia__link">Leer más →</router-link>
        </article>
      </div>
    </section>

    <section class="destacados">
      <div class="destacados__item destacados__item--claro"></div>
      <div class="destacados__item destacados__item--medio"></div>
      <div class="destacados__item destacados__item--rayas"></div>
      <div class="destacados__item destacados__item--medio"></div>
    </section>

    <section class="equipo">
      <div class="equipo__miembro"><div class="equipo__foto"></div><p class="equipo__nombre">Equipo Noti-Oax</p></div>
      <div class="equipo__miembro"><div class="equipo__foto"></div><p class="equipo__nombre">Oaxaca</p></div>
      <div class="equipo__miembro"><div class="equipo__foto"></div><p class="equipo__nombre">Comunidad</p></div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'

const noticias = ref([])
const cargando = ref(true)
const categoriaActiva = ref('Todas')
const categorias = ref(['Todas'])

onMounted(async () => {
  try {
    const res = await api.get('/noticias')
    noticias.value = res.data
    const nombres = [...new Set(noticias.value.map(n => n.nombre_categoria).filter(Boolean))]
    categorias.value = ['Todas', ...nombres]
  } catch (e) {
    console.log('Error home', e)
  } finally {
    cargando.value = false
  }
})

const noticiasFiltradas = computed(() => {
  if (categoriaActiva.value === 'Todas') return noticias.value
  return noticias.value.filter(n => n.nombre_categoria === categoriaActiva.value)
});

const getUrlImagen = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

</script>

<style scoped>
.hero { background: var(--color-primario); color: var(--color-blanco); padding: 48px 24px; text-align: center; }
.hero__titulo { font-size: 32px; margin-bottom: 12px; }
.hero__texto { color: var(--color-fondo); margin-bottom: 20px; }
.hero__boton { border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.hero__boton--primario { background: var(--color-verde-claro); color: var(--color-primario); }

.stats { display: flex; gap: 16px; padding: 20px; max-width: 900px; margin: -10px auto 0; }
.stats__item { flex: 1; background: var(--color-verde-medio); color: white; padding: 20px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; }

.noticias { max-width: 900px; margin: 0 auto; padding: 24px; }
.noticias__titulo { color: var(--color-primario); margin-bottom: 16px; }
.filtros { display: flex; gap: 8px; flex-wrap: wrap; margin: 0 0 20px; }
.filtro__btn { padding: 8px 16px; border: 1px solid var(--color-primario); background: white; color: var(--color-primario); border-radius: 20px; cursor: pointer; font-weight: bold; }
.filtro__btn--activo { background: var(--color-primario); color: white; }
.noticias__lista { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.noticia { background: var(--color-blanco); border-radius: 8px; overflow: hidden; padding-bottom: 12px; }
.noticia__imagen { height: 120px; width: 100%; object-fit: cover; background: var(--color-primario); display: block; }
.noticia__titulo { padding: 12px 12px 0; color: var(--color-primario); font-size: 17px; }
.noticia__meta { padding: 6px 12px; font-size: 12px; color: #666; }
.noticia__resumen { padding: 0 12px 8px; font-size: 14px; }
.noticia__link { padding: 0 12px; color: var(--color-verde-oscuro); font-weight: bold; font-size: 14px; cursor: pointer; text-decoration: none; }

.destacados { max-width: 900px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.destacados__item { height: 80px; border-radius: 8px; }
.destacados__item--claro { background: var(--color-verde-claro); }
.destacados__item--medio { background: var(--color-verde-medio); }
.destacados__item--rayas { background: repeating-linear-gradient(45deg, var(--color-verde-oscuro), var(--color-verde-oscuro) 5px, var(--color-verde-medio) 5px, var(--color-verde-medio) 10px); }

.equipo { max-width: 900px; margin: 0 auto; padding: 32px 24px; display: flex; justify-content: space-around; text-align: center; }
.equipo__foto { width: 70px; height: 70px; border-radius: 50%; background: var(--color-primario); margin: 0 auto 8px; }
.equipo__nombre { color: var(--color-primario); font-weight: bold; }

@media (max-width: 700px) {
  .noticias__lista { grid-template-columns: 1fr; }
  .destacados { grid-template-columns: repeat(2, 1fr); }
  .stats { flex-direction: column; }
}
</style>