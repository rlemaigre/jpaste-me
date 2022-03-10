<template>
  <div style="width: 100%; height: 100%" v-html="html"></div>
</template>

<script lang="ts">

import {defineComponent, ref, watchEffect} from "vue";
import {strokeOrder2URL} from "../ts/lib";

export default defineComponent({
  components: {},
  props: {
    character: String
  },
  setup(props, context) {
    const html = ref("");
    watchEffect(async () => {
      // Removes animation and sets everything to black.
      // Cors must be properly configured on the bucket for this to work
      let svg = await fetch(strokeOrder2URL(props.character)).then(res => res.text());
      let newStyle = `
        <style>
            svg.acjk path[clip-path] {;
                fill:none;
            }
            svg.acjk path[id] {fill:#000;}
        </style>
      `;
      svg = svg.replace(/<style>[\s\S]*<.style>/, newStyle);
      html.value = svg;
      // To do red - black gradient, see here : https://github.com/parsimonhi/animCJK/blob/master/samples/red.php
      // and here http://gooo.free.fr/animCJK/official/samples/red.php
    })
    return {
      html
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

</style>