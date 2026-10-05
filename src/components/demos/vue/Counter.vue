<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <div class="not-prose flex items-center gap-4 rounded-lg border border-dashed p-4">
    <button
      type="button"
      class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      @click="count++"
    >
      Кликов: {{ count }}
    </button>
    <span>Удвоенное: {{ double }}</span>
  </div>
</template>
