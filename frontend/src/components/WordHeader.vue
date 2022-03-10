<template>
  <div :style="cssVariables" :class="['wrapper', {mini}]">
    <div class="letters">
      <div class="letter" v-for="(letter, index) in word.characters" @click="navigate(letter.literal)">
        <img style="width: 100%; height: 100%" :style="{cursor: mini ? 'pointer' : ''}"
             :src="'data:image/svg+xml;base64,' + letter.calligraphy_svg"/>
        <div class="furigana jp-font" v-if="word.entries[0].furigana && word.entries[0].furigana[index]">
          {{ word.entries[0].furigana[index] }}
        </div>
        <span class="details" v-if="mini && isKanji(letter.literal)">(details)</span>
      </div>
      <div class="following">
        <div class="top">
          <span class="main-translation">{{ word.entries[0].senses[0].translations[0] }}</span>
        </div>
        <div class="bottom jp-font">
          {{ word.literal }} <span style="padding: 0 5px">-</span> {{ word.entries[0].reading }}
          <JapaneseAudio :text="word.literal"></JapaneseAudio>
        </div>
      </div>
    </div>
    <Stars :max="1" :rating="wordUsefulness(word.frequency)" :stars="5"
           class="stars"></Stars>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";
import {isKanji, Page, wordUsefulness} from "../ts/lib";
import SVG from "./SVG.vue";
import JapaneseAudio from "./JapaneseAudio.vue";
import Stars from "./Stars.vue";
import {Word} from "../ts/schema";

export default defineComponent({
  components: {Stars, JapaneseAudio, SVG},
  props: {
    word: Object as PropType<Word>,
    mini: Boolean,
    navigateForward: Function as PropType<(page: Page) => void>
  },
  setup(props, context) {
    const cssVariables = computed(() => {
      if (props.mini) {
        return {
          '--ratio': '0.6',
          '--color': 'white'
        }
      } else {
        return {
          '--ratio': '0.8',
          '--color': 'black'
        }
      }
    })

    function navigate(letter: string) {
      props.navigateForward({type: 'KANJI', literal: letter});
    }

    return {
      wordUsefulness,
      cssVariables,
      navigate,
      isKanji
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.letters {
  display: flex;
  position: absolute;
  bottom: calc(-50px * var(--ratio));
  left: calc(20px * var(--ratio));
  align-items: center;
  color: white;

  .letter {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 calc(9px * var(--ratio)) rgba(0, 0, 0, 0.6);
    background-color: white;
    width: calc(70px * var(--ratio));
    height: calc(70px * var(--ratio));
    margin: calc(10px * var(--ratio));
    position: relative;
    cursor: pointer;

    .furigana {
      position: absolute;
      top: calc(-45px * var(--ratio));
      font-size: calc(25px * var(--ratio));
    }

    .details {
      position: absolute;
      bottom: -20px;
      color: var(--blue-color);
      font-size: 10px;
      font-weight: 800;
    }
  }

  .following {
    padding-left: calc(15px * var(--ratio));
    display: flex;
    flex-direction: column;
    align-items: start;
    margin: calc(10px * var(--ratio));

    .top {
      line-height: calc(40px * var(--ratio));

      .main-translation {
        font-size: calc(23px * var(--ratio));
        font-weight: 800;
        text-transform: uppercase;
        filter: drop-shadow(0 0 calc(3px * var(--ratio)) rgba(0, 0, 0, 0.5));
      }
    }

    .bottom {
      line-height: calc(40px * var(--ratio));
      color: var(--color);
      font-size: calc(22px * var(--ratio));
    }
  }
}

.stars {
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 25px;
  color: white;
}

.mini {
  .stars {
    right: 15px;
    bottom: 4px;
    font-size: 14px;
  }
}

.mini {
  ::v-deep(.audio .mdi) {
    font-size: 20px;
    position: relative;
    top: 3px;
    padding-left: 2px;
  }
}

</style>