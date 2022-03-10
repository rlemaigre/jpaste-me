<template>
  <div class="stars">
    <div v-for="star in array"
         :class="['mdi', {'mdi-star-outline' : star === 0 || star === -1 || star === -2, 'mdi-star-half-full' : star === 0.5, 'mdi-star' : star === 1, 'hide': star === -1, 'hide-completely': star === -2}]"></div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: {
    /**
     * La note obtenue.
     */
    rating: Number,
    /**
     * La note maximale.
     */
    max: Number,
    /**
     * Le nombre d'étoiles qui représente la note maximale.
     */
    stars: Number
  },
  setup(props, context) {
    const array = computed(() => {
      // La note exprimée en nombre d'étoile arrondi à l'unité.
      let starRating = props.rating / props.max * props.stars;
      let rounded = Math.round(starRating);

      if (rounded > 0) {
        // Un vecteur de "stars" elements, de 0 à "stars" - 1.
        let array = [];
        for (let i = 0; i < props.stars; i++) {
          array.push(i);
        }

        // Un vecteur de "stars" élement, chaque élément vaut 0, 0.5 ou 1 selon que l'étoile est vide, à moitié pleine ou
        // pleine.
        return array.map(val => {
          if (rounded <= val) {
            return 0;
          } else if (rounded === val + 0.5) {
            return 0.5;
          } else {
            return 1;
          }
        });
      } else {
        starRating = starRating * 2 * props.stars;
        let rounded = Math.round(starRating);

        if (rounded > 0) {
          // Un vecteur de "stars" elements, de 0 à "stars" - 1.
          let array = [];
          for (let i = 0; i < props.stars; i++) {
            array.push(i);
          }

          // Un vecteur de "stars" élement, chaque élément vaut 0 ou -1 selon que l'étoile est vide ou masquée.
          return array.map(val => {
            if (rounded <= val) {
              return -1;
            } else {
              return 0;
            }
          });
        } else {
          starRating = starRating * 2 * props.stars;
          let rounded = Math.round(starRating);

          // Un vecteur de "stars" elements, de 0 à "stars" - 1.
          let array = [];
          for (let i = 0; i < props.stars; i++) {
            array.push(i);
          }

          // Un vecteur de "stars" élement, chaque élément vaut -1 ou -2 selon que l'étoile est vide ou masquée.
          return array.map(val => {
            if (rounded <= val && val !== 0) {
              return -2;
            } else {
              return -1;
            }
          });
        }
      }
    })
    return {
      array
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.stars {
  display: inline-flex;
  align-items: center;

  .hide {
    opacity: 0.25;
  }

  .hide-completely {
    opacity: 0;
  }
}

</style>