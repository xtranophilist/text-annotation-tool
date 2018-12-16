<template>
  <div v-if="img" class="image-row">
    <a href="#" @click.prevent="selectImage" :class="{selected: isSelected}">
      {{img.name}}
      </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ImageRow',
  props: {
    img: Object
  },
  components: {
    //   ImageRow
  },
  methods: {
    selectImage() {
      this.$store.commit('selectImage', this.img);
    }
  },
  computed: {
    ...mapState(['selected']),
    isSelected() {
      return this.selected.id === this.img.id;
    }
  }
};
</script>


<style>
.image-row a {
  display: block;
}
.selected{
  font-weight: bold;
}
</style>
