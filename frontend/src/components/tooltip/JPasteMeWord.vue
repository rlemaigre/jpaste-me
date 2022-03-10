<template>
  <span ref="trigger" :class="['jpasteme-word', 'link', {'tippy-opened' : tippyOpened}]">
    <span class="prefix" v-if="parts.prefix">{{ parts.prefix }}</span>
    <span class="inner" v-if="parts.inner">
      <span class="kanjis">{{ parts.inner.kanjis }}</span>
      <span class="furigana">{{ parts.inner.furigana }}</span>
    </span>
    <span class="suffix" v-if="parts.suffix">{{ parts.suffix }}</span>
  </span>
</template>

<script lang="ts">

import {computed, createApp, defineComponent, onMounted, reactive, ref} from "vue";
import tippy from "tippy.js";
import Browser from "./Browser.vue";

export default defineComponent({
  components: {},
  props: {
    lemma: String,
    text: String,
    reading: String
  },
  setup(props, context) {
    const trigger = ref<HTMLElement>();
    const tippyOpened = ref(false);
    const parts = computed<{
      prefix: string,
      suffix: string,
      inner: {
        kanjis: string,
        furigana: string
      }
    }>(() => {
      let prefixLength = 0;
      for (let i = 0; i < props.text.length; i++) {
        let readingChar = props.reading[i];
        let textChar = props.text[i];
        if (readingChar === textChar) {
          prefixLength++;
        } else {
          break;
        }
      }
      let suffixLength = 0;
      for (let i = 0; i < props.text.length; i++) {
        let readingChar = props.reading[props.reading.length - 1 - i];
        let textChar = props.text[props.text.length - 1 - i];
        if (readingChar === textChar) {
          suffixLength++;
        } else {
          break;
        }
      }
      if (props.text.length - prefixLength - suffixLength <= 0) {
        return {
          prefix: props.text,
          inner: null,
          suffix: null
        }
      } else {
        return {
          prefix: props.text.slice(0, prefixLength),
          suffix: props.text.slice(props.text.length - suffixLength),
          inner: {
            kanjis: props.text.slice(prefixLength, props.text.length - suffixLength),
            furigana: props.reading.slice(prefixLength, props.reading.length - suffixLength),
          }
        }
      }
    })
    onMounted(() => {
      let app;
      tippy(trigger.value, {
        maxWidth: 'none',
        interactive: true,
        appendTo: document.body,
        placement: 'bottom',
        trigger: 'click',
        theme: 'jpasteme-word',
        onShow(instance) {
          tippyOpened.value = true;
        },
        onMount(instance) {
          let root = instance.popper.querySelector(".tippy-content");
          app = createApp(Browser, {
            history: reactive([{
              type: 'WORD',
              literal: props.lemma
            }])
          });
          app.mount(root);
          instance.popperInstance.update();
        },
        onHide(instance) {
          tippyOpened.value = false;
        },
        onHidden(instance) {
          app.unmount();
        }
      });
    })
    return {
      trigger,
      tippyOpened,
      parts
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.jpasteme-word {
  position: relative;
  cursor: pointer;
  margin: 0 10px;
  color: #0d4582;

  &:hover, &.tippy-opened {
    box-shadow: 0 2px 0 -1px #0d4582;
  }

  .inner {
    position: relative;

    .furigana {
      position: absolute;
      top: -1.8em;
      font-size: 0.7em;
      left: 50%;
      transform: translate(-50%, 0);
      white-space: nowrap;
      pointer-events: none;
    }
  }
}

</style>