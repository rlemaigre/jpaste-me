<template>
  <div v-for="word in words" class="word">
    <div class="left jp-font">
     <span class="kanji">
       <KanjiToLinks :word="word.literal"></KanjiToLinks>
     </span>
      <span class="reading jp-font">
        {{ word.entries[0].reading }}
      </span>
      <JapaneseAudio :text="word.literal" class="audio"/>
      <span class="meaning">{{ word.entries[0].senses[0].translations[0] }}</span>
    </div>
    <div class="right">
      <router-link :to="'/word/' + word.literal" style="white-space: nowrap; margin-right: 10px">(details)</router-link>
      <Stars :rating="wordUsefulness(word.frequency)" :max="1" :stars="5" class="stars"></Stars>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {wordUsefulness} from "../ts/lib";
import JapaneseAudio from "./JapaneseAudio.vue";
import Stars from "./Stars.vue";
import KanjiToLinks from "./KanjiToLinks.vue";
import {Word} from "../ts/schema";

export default defineComponent({
  components: {KanjiToLinks, Stars, JapaneseAudio},
  props: {
    words: Array as PropType<Word[]>
  },
  setup(props, context) {
    return {
      wordUsefulness
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.stars {
  color: #0d4582;
}

.word {
  display: flex;
  align-items: center;
  padding-right: 10px;

  .left {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 28px;

    .kanji {
      padding-right: 15px;
    }

    .reading {
      padding-right: 15px;
    }

    .audio {
      padding-right: 15px;
    }
  }

  .right {
    margin-left: auto;
    white-space: nowrap;
  }
}

</style>