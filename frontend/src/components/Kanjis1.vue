<template>
  <div v-for="kanji in kanjis" class="kanji">
    <div class="left jp-font">
     <span class="literal">
      {{ kanji.literal }}
     </span>
      <span class="reading">
        {{ kanji.reading_stats[0].romaji }}
      </span>
      <span class="meaning">{{ kanji.meanings[0] }}</span>
    </div>
    <div class="right">
      <router-link :to="'/kanji/' + kanji.literal" style="white-space: nowrap; margin-right: 10px">(details)
      </router-link>
      <Stars :rating="kanjiUsefulness(kanji.frequency)" :max="1" :stars="5" class="stars"></Stars>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {kanjiUsefulness} from "../ts/lib";
import JapaneseAudio from "./JapaneseAudio.vue";
import Stars from "./Stars.vue";
import KanjiToLinks from "./KanjiToLinks.vue";
import {Kanji} from "../ts/schema";

export default defineComponent({
  components: {KanjiToLinks, Stars, JapaneseAudio},
  props: {
    kanjis: Array as PropType<Kanji[]>
  },
  setup(props, context) {
    function mainReading(kanji: Kanji) {
      let mainReading = kanji.mainReading;
      if (mainReading) {
        return (mainReading.type === 'on' ? mainReading.romaji.toUpperCase() : mainReading.romaji.toLowerCase()) + ' (' + Math.round(mainReading.count) + '%)';
      } else {
        return "";
      }
    }

    return {
      kanjiUsefulness,
      mainReading
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.stars {
  color: #0d4582;
}

.kanji {
  display: flex;
  align-items: center;
  padding-right: 10px;

  .left {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 28px;

    .literal {
      padding-right: 15px;
      font-size: 20px;
    }

    .reading {
      padding-right: 15px;
    }
  }

  .right {
    margin-left: auto;
    white-space: nowrap;
  }
}

</style>