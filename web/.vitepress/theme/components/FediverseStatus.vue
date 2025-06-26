<template>
  <span
    v-if="loaded"
    class="badge"
    :style="{ backgroundColor: colorMap[type.toLowerCase()] || '#999' }"
  >
    {{ name }} – {{ users }} users
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: { type: String, required: true }
})

const name = ref()
const type = ref('Unknown')
const users = ref('?')
const loaded = ref(false)

const colorMap = {
  mastodon: '#2b90d9',
  misskey: '#a259ff',
  sharkey: '#a259ff',
  pleroma: '#ffca28',
  akkoma: '#ff80ab',
  gotosocial: '#b65600 ',
  unknown: '#333'
}

async function fetchInstanceInfo() {
  try {
    // Try Mastodon/Misskey-compatible API
    let res = await fetch(`${props.url}/nodeinfo/2.0`)
    if (res.status == 404){
      res = await fetch(`${props.url}/nodeinfo/2.0.json`)
    }
    if (res.ok) {
      const data = await res.json()
      // console.log(data)
      if (data?.software?.name) {
        type.value = data.software.name
      } else if (data?.version?.toLowerCase().includes('mastodon')) {
        type.value = 'Mastodon'
      }
      users.value = data.usage?.users?.total || data.users || '?'
      name.value = data.metadata.nodeName	 || 'Fediverse'
      loaded.value = true
    }
  } catch (e) {
    console.error('Error loading Fediverse status:', e)
    loaded.value = true
  }
}

onMounted(fetchInstanceInfo)
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.1em 0.6em;
  font-size: 0.8em;
  font-weight: 500;
  border-radius: 0.5em;
  color: #fff;
}
.badge-muted {
  background-color: #aaa;
}
</style>
