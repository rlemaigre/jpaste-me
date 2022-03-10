<template>
  <Pane color="var(--orange-color)" :link="'/word/' +  literal" class="root">
    <template #header>
      <div class="header">
        <div class="kanji">
          <img style="width: 100%; height: 100%" :src="'data:image/svg+xml;base64,' + result.kanji.calligraphy_svg"
               class="svg" v-if="result"/>
        </div>
        <div class="following" v-if="result">
          <div class="top">{{ result.kanji.meanings[0] }}</div>
          <div class="bottom">{{ result.kanji.meanings.map(m => m[0].toUpperCase() + m.slice(1)).join(", ") }}</div>
        </div>
        <Stars :max="1" :rating="kanjiUsefulness(result.kanji.frequency)" :stars="5"
               v-if="result" class="stars"></Stars>
      </div>
    </template>
    <template #content>
      <div class="content" v-if="result">
        <div class="left">
          <div class="word" v-for="(word, index) in result.kanji.wordsContaining" :class="{even: index % 2 === 0}">
            <div class="top">
              <span class="kanjis jp-font">
                {{ word.literal }}
              </span>
              <span class="details link"
                    @click="navigateForward({type: 'WORD', literal: word.literal})">(details)</span>
              <Stars :rating="wordUsefulness(word.frequency)" :max="1" :stars="5" class="stars"></Stars>
            </div>
            <div class="bottom">
              <KanaHighlightKanji :bold="600" style="white-space: nowrap" :word="word" :kanji="literal"
                                  class="kanas"></KanaHighlightKanji>
              <JapaneseAudio :text="word.literal" class="audio"></JapaneseAudio>
              <span class="meaning">{{ word.entries[0].senses[0].translations[0] }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <ReadingsLines :readings="result.kanji.reading_stats" style="padding-right: 5px"></ReadingsLines>
        </div>
      </div>
    </template>
  </Pane>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import Pane from "./Pane.vue";
import {kanjiUsefulness, Page, wordUsefulness} from "../../../ts/lib";
import WordHeader from "../../WordHeader.vue";
import WordSenses from "../../WordSenses.vue";
import SVG from "../../SVG.vue";
import Stars from "../../Stars.vue";
import KanaHighlightKanji from "../../KanaHighlightKanji.vue";
import JapaneseAudio from "../../JapaneseAudio.vue";
import ReadingsLines from "../../ReadingsLines.vue";
import {Query} from "../../../ts/schema";
import {useQuery} from "@vue/apollo-composable";
import {gql} from "@apollo/client";

export default defineComponent({
  components: {ReadingsLines, JapaneseAudio, KanaHighlightKanji, Stars, SVG, WordSenses, WordHeader, Pane},
  props: {
    literal: String,
    navigateForward: Function as PropType<(page: Page) => void>
  },
  setup(props, context) {
    const {result} = useQuery<Query>(
        gql`
        query kanji($literal: String) {
          kanji(literal: $literal) {
            literal
            frequency
            meanings
            calligraphy_svg
            reading_stats {
              romaji
              count
            }
            wordsContaining (limit: 50) {
              literal
              frequency
              characters {
                literal
              }
              entries {
                reading
                senses {
                  translations
                }
              }
            }
          }
        }
        `,
        {
          literal: props.literal
        }
    )
    return {
      result,
      kanjiUsefulness,
      wordUsefulness
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.root {
  ::-webkit-scrollbar-thumb {
    background: var(--orange-color);
    border-radius: 10px;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 20px;

  .kanji {
    width: 60px;
    height: 60px;
    background-color: white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
    margin-right: 20px;
  }

  .following {
    display: flex;
    flex-direction: column;
    line-height: 30px;

    .top {
      text-transform: uppercase;
      font-weight: 800;
      font-size: 14px;
    }

    .bottom {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 350px;
    }
  }

  .stars {
    margin-left: auto;
    font-size: 14px;
    align-self: flex-start;
    line-height: 30px;
    padding-right: 15px;
  }
}

.content {
  display: flex;
  align-items: stretch;
  height: calc(100% - 50px);
  margin-top: 50px;

  .left {
    min-height: 0;
    overflow: auto;
    flex: 3;
    margin: 0 10px 10px 10px;

    .word {
      font-size: 12px;
      padding: 7px 10px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      min-width: 0;
      min-height: 0;

      &.even {
        background-color: rgba(255, 255, 255, 0.15);
      }

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .kanjis {
          font-size: 18px;
        }

        .details {
          margin-left: auto;
          color: var(--orange-color);
          margin-right: 10px;

          &:hover:after {
            border-color: var(--orange-color);
          }
        }

        .stars {
        }
      }

      .bottom {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        min-width: 0;
        display: flex;
        align-items: center;

        .kanas {
          padding-right: 7px;
        }

        .audio {
          padding-right: 7px;
          font-size: 16px;
        }
      }
    }

  }

  .right {
    flex: 1;
  }
}
</style>