<template>
  <div :class="{mini}">
    <div v-for="(sense, index) in word.entries[0].senses" class="parent">
      <div class="pos" v-if="pos.has(index)">{{ pos.get(index) }}</div>
      <div class="sense">
        <div class="index">{{ index + 1 }}.</div>
        <div class="translations">{{ sense.translations.join(", ") }}</div>
      </div>
      <div class="example" v-for="example in sense.examples">
        <div class="jp jp-font">{{ example.jp }}</div>
        <div class="en jp-font">{{ example.en }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";
import {Word} from "../ts/schema";
import {poses} from "../ts/lib";

export default defineComponent({
  components: {},
  props: {
    word: Object as PropType<Word>,
    mini: Boolean
  },
  setup(props, context) {
    const pos = computed(() => poses(props.word.entries[0]))
    return {
      pos
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.pos {
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
  margin: 20px 0;
}

.parent:first-child {
  .pos {
    margin: 0 0 20px 0;
  }
}

.sense {
  margin: 8px 0 8px 20px;
  display: flex;

  .index {
    flex: none;
    font-weight: 800;
    color: var(--blue-color);
    padding-right: 10px;
  }

  .translations {
    flex: 1;
  }
}

.example {
  border-left: 1px dashed var(--blue-color);
  margin-left: 50px;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.6);
}

.mini {
  font-size: 14px;

  .pos {
    color: rgba(255, 255, 255, 0.55);
  }

  .example {
    border-left: 1px dashed var(--blue-color);
    margin-left: 50px;
    padding-left: 10px;
    color: rgba(255, 255, 255, 0.55);
  }
}

</style>