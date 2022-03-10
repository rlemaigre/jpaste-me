<template>
  <div class="jp-font assisted-text" style="font-size: 18px">
    <template v-for="token in tokens">
      <JPasteMeWord :lemma="token.entry.word.literal" :reading="token.pronunciation" :text="token.text"
                    v-if="token.entry"></JPasteMeWord>
      <span v-else>{{ token.text }}</span>
    </template>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";

import JPasteMeWord from "./tooltip/JPasteMeWord.vue";
import {Token} from "../ts/schema";

export default defineComponent({
  components: {JPasteMeWord},
  props: {
    tokens: Array as PropType<Token[]>
  },
  setup(props, context) {
    return {}
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.assisted-text {
  line-height: 42px;
  overflow-x: hidden;
  padding: 10px;
}

</style>