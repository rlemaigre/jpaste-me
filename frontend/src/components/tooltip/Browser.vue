<template>
  <div class="viewport">
    <transition :name="transition">
      <component :is="KanjiPane" :literal="currentPage.literal" :navigate-forward="navigateForward"
                 v-if="currentPage.type === 'KANJI'"
                 :key="pageKey" class="pane"></component>
      <component :is="WordPane" :literal="currentPage.literal" :navigate-forward="navigateForward" v-else
                 :key="pageKey" class="pane"></component>
    </transition>
  </div>
  <div class="controls">
    <div :class="['back-button', {disabled: history.length === 1}]" @click="back">
      <span class="mdi mdi-chevron-left"></span>
    </div>
    <div class="history">
      <transition-group name="fade">
        <div
            :class="['history-item', {'word': page.type === 'WORD', 'kanji': page.type === 'KANJI', current: index === history.length - 1}]"
            v-for="(page, index) in history" :key="index">
          <span style="padding: 0 5px; color: white" v-if="index !== 0">/</span>
          <span class="link jp-font" @click="navigateBackward(page)" v-if="index !== history.length - 1"
                :style="{color: page.type === 'KANJI' ? 'var(--orange-color)' : '#2682b5'}">{{
              page.literal
            }}</span>
          <span class="jp-font" v-else>{{ page.literal }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent, PropType, provide, ref} from "vue";
import {Page} from "../../ts/lib";
import KanjiPane from "./panes/KanjiPane.vue";
import WordPane from "./panes/WordPane.vue";
import {DefaultApolloClient} from "@vue/apollo-composable";
import {apollo} from "../../ts/globals";

export default defineComponent({
  components: {},
  props: {
    history: Array as PropType<Page[]>
  },
  setup(props, context) {
    const pageKey = ref(1);
    const transition = ref<'backward' | 'forward'>();

    const currentPage = computed(() => props.history[props.history.length - 1]);

    const precedingPage = computed(() => {
      if (props.history.length > 1) {
        return props.history[props.history.length - 2];
      } else {
        return null;
      }
    });

    function navigateForward(page: Page) {
      transition.value = 'forward';
      props.history.push(page);
      pageKey.value++;
    }

    function navigateBackward(page: Page) {
      transition.value = 'backward';
      let index = props.history.indexOf(page);
      props.history.splice(index + 1);
      pageKey.value++;
    }

    function back() {
      if (props.history.length > 1) {
        navigateBackward(precedingPage.value);
      }
    }

    provide(DefaultApolloClient, apollo)

    return {
      currentPage,
      precedingPage,
      navigateForward,
      navigateBackward,
      KanjiPane,
      WordPane,
      pageKey,
      transition,
      back
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.viewport {
  width: 550px;
  height: 420px;
  overflow: hidden;
  position: relative;
}

.pane {
  opacity: 1;
  transform: translate(0, 0);
  position: absolute;
}

.controls {
  display: flex;
  line-height: 25px;
  justify-content: flex-start;
  align-items: stretch;
  font-size: 16px;

  .back-button {
    text-align: center;
    width: 25px;
    margin: 0 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &.disabled {
      color: rgba(255, 255, 255, 0.5);

      &:hover {
        background-color: transparent;
        cursor: default;
      }
    }
  }

  .history {
    display: flex;

    .history-item {
      transition: color 0.3s, opacity 0.3s;

      .jp-font {
        font-weight: 500;
      }

      &.kanji {
        color: var(--orange-color);

        .link {
          &:hover:after {
            border-color: var(--orange-color);
          }
        }
      }

      &.word {
        color: var(--blue-color);

        .link {
          &:hover:after {
            border-color: var(--blue-color);
          }
        }
      }

      &.current {
        color: white;
      }
    }
  }

}

.forward-enter-active, .forward-leave-active, .backward-enter-active, .backward-leave-active {
  transition: 0.3s opacity, 0.3s transform;
}

.forward-enter-from {
  opacity: 0;
  transform: translate(150px, 0);
}

.forward-leave-to {
  opacity: 0;
  transform: translate(-150px, 0);
}

.backward-enter-from {
  opacity: 0;
  transform: translate(-150px, 0);
}

.backward-leave-to {
  opacity: 0;
  transform: translate(150px, 0);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0 !important;
}
</style>