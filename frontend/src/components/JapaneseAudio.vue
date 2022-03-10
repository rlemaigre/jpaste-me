<template>
  <span style="cursor: pointer; color: var(--red-color)" class="audio">
    <span class="mdi mdi-volume-medium" v-if="!playing" @click="play"></span>
    <span class="mdi mdi-stop" v-else @click="stop"></span>
  </span>
</template>

<script lang="ts">

import {defineComponent, ref} from "vue";
import {say} from "../ts/lib";

export default defineComponent({
  components: {},
  props: {
    text: String
  },
  setup(props, context) {
    const playing = ref(false);
    const stop = ref(() => {
    });
    const play = async () => {
      stop.value = await say(props.text, () => {
        playing.value = false;
      });
      playing.value = true;
    }
    return {
      playing,
      stop,
      play
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

</style>