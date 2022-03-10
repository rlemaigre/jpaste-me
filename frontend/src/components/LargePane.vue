<template>
  <div class="pane comp" :style="{...cssVariables}">
    <div class="header">
      <slot name="header"/>
    </div>
    <div class="content">
      <slot name="content"/>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: {
    color: String,
    link: String
  },
  setup(props, context) {
    const cssVariables = computed(() => {
      return {
        "--header-background-color": props.color
      }
    })
    return {
      cssVariables
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.pane {
  height: 100%;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;

  .header {
    height: 70px;
    flex: none;
    background-color: var(--header-background-color);
    position: relative;
  }

  .content {
    min-height: 0;
    height: calc(100% - 320px);
    padding: 45px 20px 20px 20px;
  }
}

</style>