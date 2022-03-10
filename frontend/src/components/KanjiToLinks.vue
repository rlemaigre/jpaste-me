<template>
  <template v-for="letter in letters">
    <span class="jp-font" style="font-size: 20px">
      <router-link :to="'/kanji/' + letter" v-if="isKanji(letter) && letter !== kanji">{{ letter }}</router-link>
      <span v-else>{{ letter }}</span>
    </span>
  </template>
</template>

<script lang="ts">

import {computed, defineComponent} from "vue";
import {isKanji} from "../ts/lib";

export default defineComponent({
  components: {},
  props: {
    word: String,
    kanji: String
  },
  setup(props, context) {
    const letters = computed(() => Array.from(props.word));

    return {
      letters,
      isKanji
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

</style>