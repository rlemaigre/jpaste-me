<template>
  <div class="comp">
    <div v-if="loading" class="loading">
      <ProgressSpinner/>
    </div>
    <TabView style="height: calc(100% - 250px)" v-else>
      <TabPanel header="Text">
        <AssistedText :tokens="result.analysis.tokens"></AssistedText>
      </TabPanel>
      <TabPanel header="Vocabulary">
        <Words1 :words="result.analysis.words"/>
      </TabPanel>
      <TabPanel header="Kanji">
        <Kanjis1 :kanjis="result.analysis.kanjis"/>
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Layout from "../Layout.vue";
import AssistedText from "../AssistedText.vue";
import Words1 from "../Words1.vue";
import Kanjis1 from "../Kanjis1.vue";
import {useQuery} from "@vue/apollo-composable";
import {gql} from "@apollo/client";
import {text} from "../../ts/globals";
import {Query} from "../../ts/schema";

export default defineComponent({
  components: {Kanjis1, Words1, AssistedText, Layout},
  name: 'AnonymousPasteView',
  setup() {
    const {result, loading} = useQuery<Query>(
        gql`
        query analyseText($text: String) {
          analysis(text: $text) {
            tokens {
              entry {
                word {
                  literal
                }
              }
              pronunciation
              text
            }
            words {
              literal
              frequency
              entries {
                reading
                senses {
                  translations
                }
              }
            }
            kanjis {
              literal
              frequency
              meanings
              reading_stats {
                romaji
              }
            }
          }
        }
        `,
        () => {
          return {
            text: text.value
          }
        }, {
          fetchPolicy: "no-cache"
        }
    );

    return {
      result,
      loading
    }
  }
})

</script>

<style scoped lang="scss">

.comp {
  opacity: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.loading {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-tabview {
  display: flex;
  flex-direction: column;
}

::v-deep(.p-tabview-panels) {
  flex: 1;
  min-height: 0;
  background-color: transparent;
}

::v-deep(.p-tabview-panel) {
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
    background-color: #2682b5;
  }
}

</style>