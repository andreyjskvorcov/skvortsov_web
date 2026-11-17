<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { Button } from '@skvortsov/ui-vue/button';
import { Card, CardContent } from '@skvortsov/ui-vue/card';

const elapsed = ref(0);
const laps = ref<number[]>([]);
const running = ref(false);

let startedAt = 0;
let timer: number | undefined;

function start() {
  startedAt = performance.now() - elapsed.value;
  timer = window.setInterval(() => (elapsed.value = performance.now() - startedAt), 31);
  running.value = true;
}

function stop() {
  window.clearInterval(timer);
  running.value = false;
}

function reset() {
  stop();
  elapsed.value = 0;
  laps.value = [];
}

function lap() {
  laps.value.unshift(elapsed.value);
}

const format = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return [m, s, cs].map((n) => String(n).padStart(2, '0')).join(':');
};

const time = computed(() => format(elapsed.value));

onUnmounted(stop);
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardContent class="grid gap-4">
      <p class="text-center font-mono text-5xl font-bold tabular-nums">{{ time }}</p>

      <div class="flex justify-center gap-2">
        <Button v-if="!running" @click="start">Старт</Button>
        <Button v-else @click="stop">Пауза</Button>
        <Button variant="outline" :disabled="!running" @click="lap">Круг</Button>
        <Button variant="ghost" :disabled="!elapsed" @click="reset">Сброс</Button>
      </div>

      <ol v-if="laps.length" class="grid gap-1 border-t pt-4 font-mono text-sm tabular-nums">
        <li v-for="(t, i) in laps" :key="laps.length - i" class="flex justify-between text-muted-foreground">
          <span>Круг {{ laps.length - i }}</span>
          <span class="text-foreground">{{ format(t) }}</span>
        </li>
      </ol>
    </CardContent>
  </Card>
</template>
