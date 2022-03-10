<template>
  <Pane color="#2682b5" :link="'/word/' +  literal" class="root">
    <template #header>
      <WordHeader :word="result.word" mini :navigate-forward="navigateForward" v-if="result"/>
    </template>
    <template #content>
      <div style="height: calc(100% - 30px); overflow: auto; margin-top: 30px">
        <WordSenses :word="result.word" mini style="padding: 20px 10px 10px 10px" v-if="result"/>
      </div>
    </template>
  </Pane>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import Pane from "./Pane.vue";
import {Page} from "../../../ts/lib";
import WordHeader from "../../WordHeader.vue";
import WordSenses from "../../WordSenses.vue";
import {useQuery} from "@vue/apollo-composable";
import {Query} from "../../../ts/schema";
import {gql} from "@apollo/client";

export default defineComponent({
  components: {WordSenses, WordHeader, Pane},
  props: {
    literal: String,
    navigateForward: Function as PropType<(page: Page) => void>
  },
  setup(props, context) {
    const {result} = useQuery<Query>(
        gql`
          query word($literal: String) {
            word (literal: $literal) {
              literal
              frequency
              characters {
                literal
                ...on Kana {
                  calligraphy_svg
                }
                ...on Kanji {
                  calligraphy_svg
                }
              }
              entries {
                reading
                furigana
                senses {
                  translations
                  pos
                  examples {
                    jp
                    en
                  }
                }
              }
            }
          }
        `,
        () => {
          return {
            literal: props.literal
          }
        }
    )
    return {
      result
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.root {
  ::-webkit-scrollbar-thumb {
    background: var(--blue-color);
    border-radius: 10px;
  }
}
</style>