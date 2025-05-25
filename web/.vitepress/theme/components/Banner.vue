<template>
  <div class="banner">
    <div class="overlay">
      <h1 class="text">{{ text }}</h1>
    </div>
    <img
      class="background"
      :src="fullImagePath"
      alt="Banner Image"
      :style="{ filter: `blur(${blurAmount})` }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  blur: {
    type: [Number, String],
    default: 8 // значення за замовчуванням — 8px
  }
})

const fullImagePath = computed(() => {
  return `${import.meta.env.BASE_URL}${props.image}`.replace(/([^:]\/)\/+/g, '$1')
})

const blurAmount = computed(() => {
  return typeof props.blur === 'number' ? `${props.blur}px` : props.blur
})
</script>

<style scoped>
.banner {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
}

.background {
  width: 1000px;
  height: 200px;
  object-fit: cover;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  color: white;
  font-size: 48px;
  font-weight: 300;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  z-index: 1;
}
</style>
