<template>
  <div class="Box">
    <div class="title">
      <span class="mdi mdi-chevron-right icon" :style="{color}"></span>
      <slot name="title"></slot>
    </div>
    <div class="content" :style="{backgroundColor: fillBg ? 'white' : 'transparent'}">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      default: 'var(--orange-color)'
    },
    fillBg: {
      type: Boolean,
      default: true
    }
  }
})
</script>

<style scoped lang="scss">
.Box {
  display: flex;
  flex-direction: column;
  margin: 0 25px 25px 0;

  .title {
    flex: none;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    align-items: center;
    position: relative;
    left: -5px;

    .icon {
      font-size: 21px;
    }
  }

  .content {
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.13);
    padding: 10px;
  }

}
</style>