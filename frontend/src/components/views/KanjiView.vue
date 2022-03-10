<template>
  <LargePane color="var(--orange-color)" class="root">
    <template #header>
      <div class="header" v-if="result">
        <div class="letter">
          <img style="width: 100%; height: 100%" :src="'data:image/svg+xml;base64,' + result.kanji.calligraphy_svg"/>
        </div>
        <div class="following">
          <div class="top">
            {{ result.kanji.meanings[0] }}
          </div>
          <div class="bottom jp-font">
            <span>{{ result.kanji.meanings.join(", ") }}</span>
          </div>
        </div>
        <Stars :max="1" :rating="kanjiUsefulness(result.kanji.frequency)" :stars="5" class="stars"></Stars>
      </div>
    </template>
    <template #content>
      <div class="scroll" style="margin-top:  20px" v-if="result">
        <div class="title">Stroke order</div>
        <div class="stroke-order">
          <img :src="'data:image/svg+xml;base64,' + result.kanji.stroke_order_svg" height="80"/>
        </div>
        <div class="title">Readings</div>
        <ReadingsLines :readings="result.kanji.reading_stats" :max="1000" light/>
        <div class="title" style="margin-top: 25px">Words</div>
        <Words :words="result.kanji.wordsContaining" :cols="1" :kanji="result.kanji.literal"/>
      </div>
    </template>
  </LargePane>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import {kanjiUsefulness} from "../../ts/lib";
import LargePane from "../LargePane.vue";
import ReadingsLines from "../ReadingsLines.vue";
import Words from "../Words.vue";
import SVG from "../SVG.vue";
import Stars from "../Stars.vue";
import {useQuery} from "@vue/apollo-composable";
import {Query} from "../../ts/schema";
import {gql} from "@apollo/client";

export default defineComponent({
  components: {Stars, SVG, Words, ReadingsLines, LargePane},
  setup() {
    const route = useRoute();
    const {result, loading} = useQuery<Query>(
        gql`
          query kanji($literal: String) {
            kanji(literal: $literal) {
              literal
              frequency
              meanings
              calligraphy_svg
              stroke_order_svg
              reading_stats {
                romaji
                count
              }
              wordsContaining(limit: 50) {
                literal
                frequency
                characters {
                  literal
                }
                entries {
                  reading
                  furigana
                  senses {
                    translations
                  }
                }
              }
            }
          }
        `
        ,
        () => {
          return {
            literal: route.params.literal
          }
        }
    );
    return {
      result,
      loading,
      kanjiUsefulness
    }
  }
})


</script>

<style scoped lang="scss">

.header {
  display: flex;
  align-items: center;
  position: relative;
  top: 30px;
  padding-left: 20px;

  .letter {
    height: 80px;
    width: 80px;
    background-color: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  }

  .following {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;

    .top {
      text-transform: capitalize;
      line-height: 30px;
      color: white;
      font-size: 18px;
      font-weight: 800;
    }

    .bottom {
      line-height: 30px;
    }
  }

  .stars {
    margin-left: auto;
    color: white;
    font-size: 25px;
    position: relative;
    top: -30px;
    right: 20px;
  }
}

.title {
  font-weight: 600;
  margin: 10px 0;
}

.stroke-order {
  overflow: auto;
  padding: 5px;
}

.scroll {
  overflow: auto;
  height: 100%;
  padding-right: 20px;
}

::v-deep(*) {
  &::-webkit-scrollbar {
    width: 12px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--orange-color);
  }
}
</style>