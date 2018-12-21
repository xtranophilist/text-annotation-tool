<template>
  <div class="sidebar">
    <h1>OCR GT</h1>
    <!-- {{presets}} -->
    Preset: <select @change="updatePreset($event.target.value)" :value="preset">
      <option value="">None</option>
      <option v-for="(value, key) in presets" :key="key">{{key}}</option>
    </select>
    <a href="#" @click.prevent="clearFiles">Clear</a>
    {{size}} KB
    <Dropzone/>
    <div v-for="image in enabledImages" :key="image.id">
      <ImageRow :img="image"/>
    </div>
  </div>
</template>

<script>
import Dropzone from "./Dropzone.vue";
import ImageRow from "./ImageRow.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  components: {
    Dropzone,
    ImageRow
  },
  data() {
    return {
      size: 0
    };
  },
  created() {
    // this.$store.watch(state => state, this.handleStateUpdate, {deep: true});
    this.handleStateUpdate()
  },
  methods: {
    clearFiles() {
      this.$store.commit("clearFiles");
    },
    updatePreset(val) {
      this.$store.commit("updatePreset", val);
    },
    handleStateUpdate() {
      let allStrings = "";
      for (let key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          allStrings += window.localStorage[key];
        }
      }
      this.size = allStrings
        ? ((3 + allStrings.length * 16 / (8 * 1024)))
        : 0;
    }
  },
  computed: {
    ...mapState(["images", "preset", "presets"]),
    ...mapGetters(["enabledImages"]),
  }
};
</script>

<style>
.sidebar {
  border-right: 1px solid black;
  height: 100%;
  margin-right: 1em;
  max-height: 100vh;
  overflow-y: auto;
}
</style>
