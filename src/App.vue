<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Fireworks } from '@fireworks-js/vue'
import LoudSpeaker from '@/components/icons/LoudSpeaker.vue'
import MutedSpeaker from '@/components/icons/MutedSpeaker.vue'

const progressbarMax = 10
let interval: number | undefined = undefined

const departure = ref(new Date(Date.UTC(2024, 7, 1, 16, 0, 0, 0)).getTime())
const arrival = ref(new Date(Date.UTC(2024, 9, 1, 16, 0, 0)).getTime())
const now = ref(new Date().getTime())
const canIHoldYouInMyArms = ref(false)
const isPlaying = ref(false)
const bgmusic = ref<HTMLAudioElement>()
const fireworksSfx = ref<HTMLAudioElement>()

const rest = computed(() => {
  return arrival.value - now.value
})

const howLongYouFly = computed(() => {
  const days = Math.floor(rest.value / (1000 * 60 * 60 * 24))
  const hours = Math.floor((rest.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((rest.value % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((rest.value % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds
  }
})

const doubleFuck = computed(() => {
  const { days, hours, minutes } = howLongYouFly.value
  if (days === 0 && hours === 0 && minutes <= 20) {
    return true
  }

  return false
})

const percentage = computed(() => {
  const goal = arrival.value - departure.value
  const completed = now.value - departure.value
  return Math.round((completed * 100) / goal)
})

watch(rest, () => {
  if (rest.value <= 0) {
    canIHoldYouInMyArms.value = true
  }
})

watch(canIHoldYouInMyArms, () => {
  clearInterval(interval)
})

watch(fireworksSfx, () => {
  if (fireworksSfx.value) {
    if (isPlaying.value) {
      fireworksSfx.value.volume = 0.5
      fireworksSfx.value.play()
    }
  }
})

onMounted(() => {
  interval = setInterval(countDown, 1000)
})

const countDown = () => {
  now.value = new Date().getTime()
}

const opacity = (n: number): string | Array<string> => {
  const fullBars = Math.floor(percentage.value / progressbarMax)

  if (fullBars >= n) {
    return 'opacity-100'
  }

  if (fullBars + 1 === n) {
    switch (percentage.value % 10) {
      case 1:
        return 'opacity-10'
      case 2:
        return 'opacity-20'
      case 3:
        return 'opacity-30'
      case 4:
        return 'opacity-40'
      case 5:
        return 'opacity-50'
      case 6:
        return 'opacity-60'
      case 7:
        return 'opacity-70'
      case 8:
        return 'opacity-80'
      case 9:
        return 'opacity-90'
    }
  }

  return 'opacity-5'
}

const togglePlaying = () => {
  if (bgmusic.value) {
    isPlaying.value = !isPlaying.value
    if (bgmusic.value.paused && isPlaying.value) {
      bgmusic.value.volume = 0.2
      bgmusic.value.play()
      if (fireworksSfx.value) {
        fireworksSfx.value.volume = 0.5
        fireworksSfx.value.play()
      }
    } else {
      bgmusic.value.muted = !isPlaying.value
      if (fireworksSfx.value) {
        fireworksSfx.value.muted = !isPlaying.value
      }
    }
  }
}
</script>

<template>
  <main
    v-if="canIHoldYouInMyArms"
    class="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-900 p-8 sm:gap-8 sm:p-12 md:gap-10"
  >
    <Fireworks :autostart="true" class="fixed left-0 top-0 h-full w-full" />
    <h1
      class="text-center font-sc text-5xl text-white selection:bg-white selection:text-zinc-900 sm:text-7xl md:text-8xl"
    >
      欢迎回来
    </h1>
    <div class="flex select-none gap-4 sm:gap-5 md:gap-6">
      <img
        src="/nora.png"
        alt="Nora avatar"
        class="w-20 object-scale-down sm:w-40 sm:object-cover md:w-52"
      />
      <img src="/heart.png" alt="heart" class="w-16 object-scale-down sm:w-32 md:w-40" />
      <img
        src="/sebastian.png"
        alt="Sebastian avatar"
        class="w-20 object-scale-down sm:w-40 sm:object-cover md:w-52"
      />
    </div>
    <audio loop ref="fireworksSfx">
      <source src="/firework.mp3" type="audio/mpeg" />
    </audio>
  </main>
  <main
    v-else
    class="sm:gap8 flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-900 p-8 selection:bg-white selection:text-zinc-900 sm:p-12 md:gap-10"
  >
    <h1 class="text-center font-display text-5xl text-white sm:text-7xl md:text-8xl">
      How long you fly?!
    </h1>
    <div class="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
      <span class="text-center text-sm text-zinc-400 sm:text-base">{{ percentage }}%</span>
      <div class="flex gap-1.5 sm:gap-4">
        <div
          v-for="n in 10"
          :key="n"
          class="size-3 bg-green-500 duration-500 sm:size-6 md:size-8"
          :class="[opacity(n)]"
        ></div>
      </div>
    </div>
    <div
      class="flex flex-col gap-2 font-display text-3xl text-white sm:flex-row sm:gap-6 md:text-4xl"
    >
      <span v-if="howLongYouFly.days > 0">{{ howLongYouFly.days }} days</span>
      <span v-if="howLongYouFly.hours > 0 || howLongYouFly.days > 0"
        >{{ howLongYouFly.hours.toString().padStart(2, '0') }} hours</span
      >
      <span v-if="howLongYouFly.minutes > 0 || howLongYouFly.hours > 0 || howLongYouFly.days > 0"
        >{{ howLongYouFly.minutes.toString().padStart(2, '0') }} minutes</span
      >
      <span>{{ howLongYouFly.seconds.toString().padStart(2, '0') }} seconds</span>
      <span v-if="doubleFuck" class="flex items-center gap-1.5 text-red-600"
        >double fuck! <img src="/heart.png" alt="heart" class="h-8"
      /></span>
    </div>
  </main>
  <button
    @click="togglePlaying()"
    class="fixed right-3 top-3 flex items-center justify-center rounded-full p-3 text-zinc-700 duration-300 ease-in-out hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white focus:outline-none"
  >
    <MutedSpeaker v-if="!isPlaying" class="size-12" />
    <LoudSpeaker v-else class="size-12" />
  </button>
  <audio loop ref="bgmusic">
    <source src="/bg_music.mp3" type="audio/mpeg" />
  </audio>
</template>
