<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <div class="demo">
    <button type="button" @click="count++">Кликов: {{ count }}</button>
    <span>Удвоенное: {{ double }}</span>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}
button {
  padding: var(--space-2) var(--space-4);
  font: inherit;
  cursor: pointer;
}
</style>
