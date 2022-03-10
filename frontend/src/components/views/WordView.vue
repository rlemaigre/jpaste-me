<template>
  <LargePane :color="'#365e99'">
    <template #header>
      <WordHeader :word="result.word" v-if="!loading" :navigate-forward="navigate"/>
    </template>
    <template #content>
      <div class="scroll">
        <WordSenses :word="result.word" v-if="!loading"/>
      </div>
    </template>
  </LargePane>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import Layout from "../Layout.vue";
import {useRoute, useRouter} from "vue-router";
import Box from "../Box.vue";
import WordHeader from "../WordHeader.vue";
import WordSenses from "../WordSenses.vue";
import LargePane from "../LargePane.vue";
import {useQuery} from "@vue/apollo-composable";
import {gql} from "@apollo/client";
import {Query} from "../../ts/schema";

export default defineComponent({
  components: {LargePane, WordSenses, WordHeader, Box, Layout},
  props: {},
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const {loading, result} = useQuery<Query>(
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
            literal: route.params.literal
          }
        }
    )

    function navigate(page) {
      router.push("/kanji/" + page.literal);
    }

    return {
      result,
      loading,
      navigate
    }
  }
})
</script>

<style scoped lang="scss">
@use "sass:color";
@import "src/scss/global.scss";

.scroll {
  overflow: auto;
  height: 100%;
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
    background-color: #365e99;
  }
}

</style>