<template>
  <div style="overflow: auto" ref="scroll">
    <div class="flex flex-wrap">
      <div class="word" :style="{width: 'calc(99% / ' + cols + ')'}" v-for="word in words">
        <div class="left">
              <span class="kanji" style="font-size: 18px; white-space: nowrap">
                <KanjiToLinks :word="word.literal" :kanji="kanji"/>
              </span>
          <KanaHighlightKanji style="white-space: nowrap" :word="word" :kanji="kanji"></KanaHighlightKanji>
          <JapaneseAudio :text="word.literal" class="audio"/>
          <span class="meaning">{{ word.entries[0].senses[0].translations[0] }}</span>
        </div>
        <div class="right">
          <router-link :to="'/word/' + word.literal" style="white-space: nowrap">(details <span
              class="mdi mdi-arrow-right-bold"/>)
          </router-link>
          <Stars :rating="wordUsefulness(word.frequency)" :max="1" :stars="5" class="stars"></Stars>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {wordUsefulness} from "../ts/lib";
import Stars from "./Stars.vue";
import KanjiToLinks from "./KanjiToLinks.vue";
import JapaneseAudio from "./JapaneseAudio.vue";
import KanaHighlightKanji from "./KanaHighlightKanji.vue";
import {Word} from "../ts/schema";

export default defineComponent({
  components: {KanaHighlightKanji, JapaneseAudio, KanjiToLinks, Stars},
  props: {
    kanji: String,
    words: Array as PropType<Word[]>,
    cols: Number
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

.word {
  display: flex;
  padding: 4px;

  .left {
    display: flex;
    align-items: center;

    .kanji {
      padding-right: 15px;
    }

    .audio {
      padding-right: 15px;
    }

    .meaning {
    }
  }

  .right {
    margin-left: auto;
    display: flex;
    align-items: center;
    padding-right: 10px;

    .details {
      font-size: 12px;
      padding-right: 5px;
      color: var(--orange-color);
    }
  }

  .stars {
    color: var(--orange-700);
  }
}
</style>