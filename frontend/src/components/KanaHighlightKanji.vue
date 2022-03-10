<template>
  <span class="jp-font">
    <span v-if="!word.entries[0].furigana">{{ word.entries[0].reading }}</span>
    <span v-else>
      <span v-for="(character, index) in word.characters">
        <span v-if="word.entries[0].furigana[index]"
              :style="{fontWeight: character.literal === kanji ? bold : 300}">{{
            word.entries[0].furigana[index]
          }}</span>
        <span v-else>{{ character.literal }}</span>
      </span>
    </span>
  </span>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {Word} from "../ts/schema";

export default defineComponent({
  components: {},
  props: {
    word: Object as PropType<Word>,
    kanji: String,
    bold: {
      default: 500,
      type: Number
    }
  },
  setup(props, context) {
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.highlight {
  font-weight: 500;
}

</style>