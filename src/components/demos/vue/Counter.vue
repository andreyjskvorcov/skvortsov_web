<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@skvortsov/ui-vue/button';

const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <div class="not-prose flex items-center gap-4 rounded-lg border border-dashed p-4">
    <Button @click="count++">Кликов: {{ count }}</Button>
    <span>Удвоенное: {{ double }}</span>
  </div>
</template>
