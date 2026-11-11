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

    <section class="equipo" aria-labelledby="equipo-titulo">
      <div class="equipo__encabezado">
        <p class="equipo__etiqueta">Conoce a quienes hacen Noti-Oax</p>
        <h2 id="equipo-titulo" class="equipo__titulo">Nuestro equipo</h2>
        <span class="equipo__linea" aria-hidden="true"></span>
      </div>
      <p v-if="cargandoEquipo" class="equipo__estado">Cargando equipo...</p>
      <p v-else-if="errorEquipo" class="equipo__estado equipo__error" role="alert">{{ errorEquipo }}</p>
      <p v-else-if="equipo.length === 0" class="equipo__estado">No hay integrantes para mostrar.</p>
      <div v-else class="equipo__carrusel" :class="{ 'equipo__carrusel--varios': equipo.length > 1, 'equipo__carrusel--muchos': equipo.length > 3 }">
        <button type="button" class="equipo__control" aria-label="Ver integrantes anteriores" @click="moverEquipo(-1)">&#8592;</button>
        <div ref="listaEquipo" class="equipo__lista" role="region" aria-label="Integrantes del equipo" tabindex="0">
          <div v-for="miembro in equipo" :key="miembro.id_usuario" class="equipo__miembro">
            <div class="equipo__marco">
              <img
                v-if="miembro.foto_perfil && !fotosFallidas.has(miembro.id_usuario)"
                :src="getUrlImagen(miembro.foto_perfil)"
                class="equipo__foto"
                alt=""
                @error="marcarFotoFallida(miembro.id_usuario)"
              />
              <div v-else class="equipo__foto equipo__iniciales" aria-hidden="true">{{ iniciales(miembro.nombre) }}</div>
            </div>
            <p class="equipo__nombre">{{ miembro.nombre }}</p>
          </div>
        </div>
        <button type="button" class="equipo__control" aria-label="Ver siguientes integrantes" @click="moverEquipo(1)">&#8594;</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import { getUrlImagen } from '../services/imagenes'

const noticias = ref([])
const cargando = ref(true)
const categoriaActiva = ref('Todas')
const categorias = ref(['Todas'])
const equipo = ref([])
const cargandoEquipo = ref(true)
const errorEquipo = ref('')
const fotosFallidas = ref(new Set())
const listaEquipo = ref(null)

async function cargarEquipo() {
  try {
    const res = await api.get('/equipo')
    if (!Array.isArray(res.data) || !res.data.every(miembro =>
      miembro && (typeof miembro.id_usuario === 'number' || typeof miembro.id_usuario === 'string') &&
      typeof miembro.nombre === 'string' && miembro.nombre.trim() &&
      (miembro.foto_perfil == null || typeof miembro.foto_perfil === 'string')
    )) {
      throw new Error('La respuesta del equipo tiene un formato inválido')
    }
    equipo.value = res.data
  } catch (e) {
    console.error('Error al cargar equipo', e)
    errorEquipo.value = 'No se pudo cargar el equipo.'
  } finally {
    cargandoEquipo.value = false
  }
}

function iniciales(nombre) {
  return nombre.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join('').toUpperCase()
}

function marcarFotoFallida(id) {
  fotosFallidas.value = new Set([...fotosFallidas.value, id])
}

function moverEquipo(direccion) {
  const lista = listaEquipo.value
  if (!lista) return
  const miembro = lista.querySelector('.equipo__miembro')
  if (miembro) lista.scrollBy({ left: direccion * miembro.offsetWidth, behavior: 'auto' })
}

onMounted(async () => {
  cargarEquipo()
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

.equipo { max-width: 900px; margin: 24px auto 0; padding: 48px 32px; text-align: center; background: var(--color-blanco); border-radius: 16px; }
.equipo__encabezado { margin-bottom: 28px; }
.equipo__etiqueta { color: var(--color-verde-oscuro); font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; }
.equipo__titulo { color: var(--color-primario); font-size: 28px; margin: 8px 0 14px; }
.equipo__linea { display: block; width: 44px; height: 3px; margin: 0 auto; border-radius: 3px; background: var(--color-verde-medio); }
.equipo__estado { color: var(--color-primario); padding: 16px 0; }
.equipo__carrusel { display: flex; align-items: center; gap: 16px; }
.equipo__lista { display: flex; flex: 1; min-width: 0; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: thin; }
.equipo__carrusel:not(.equipo__carrusel--muchos) .equipo__lista { justify-content: center; }
.equipo__lista:focus-visible { outline: 2px solid var(--color-verde-oscuro); outline-offset: 3px; border-radius: 8px; }
.equipo__miembro { flex: 0 0 33.333%; min-width: 0; padding: 16px 12px 20px; scroll-snap-align: start; }
.equipo__marco { width: 114px; height: 114px; margin: 0 auto 16px; padding: 5px; border: 1px solid var(--color-verde-medio); border-radius: 50%; }
.equipo__foto { width: 100%; height: 100%; border-radius: 50%; background: var(--color-primario); object-fit: cover; display: block; }
.equipo__iniciales { display: flex; align-items: center; justify-content: center; color: var(--color-blanco); font-size: 30px; font-weight: bold; }
.equipo__nombre { color: var(--color-primario); font-size: 16px; font-weight: bold; overflow-wrap: anywhere; }
.equipo__control { display: none; flex: 0 0 auto; width: 38px; height: 38px; border: 1px solid var(--color-fondo); border-radius: 50%; background: var(--color-blanco); color: var(--color-primario); font-size: 20px; cursor: pointer; transition: background-color 0.2s, border-color 0.2s; }
.equipo__control:hover { background: var(--color-fondo); border-color: var(--color-verde-medio); }
.equipo__control:focus-visible { outline: 2px solid var(--color-verde-oscuro); outline-offset: 3px; }
.equipo__carrusel--muchos .equipo__control { display: block; }
.equipo__error { color: #a02222; }

@media (max-width: 700px) {
  .noticias__lista { grid-template-columns: 1fr; }
  .destacados { grid-template-columns: repeat(2, 1fr); }
  .stats { flex-direction: column; }
  .equipo { margin: 24px; padding: 36px 16px; }
  .equipo__titulo { font-size: 24px; }
  .equipo__carrusel { gap: 8px; }
  .equipo__carrusel--varios .equipo__lista { justify-content: flex-start; }
  .equipo__miembro { flex-basis: 100%; }
  .equipo__carrusel--varios .equipo__control { display: block; }
}
@media (prefers-reduced-motion: reduce) {
  .equipo__lista { scroll-behavior: auto; }
  .equipo__control { transition: none; }
}
</style>