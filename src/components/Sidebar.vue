<template>
  <div class="sidebar">
    <h1>OCR GT</h1>
    <!-- {{presets}} -->
    Preset: <select @change="updatePreset($event.target.value)" :value="preset">
      <option value="">None</option>
      <option v-for="(value, key) in presets" :key="key">{{key}}</option>
    </select>
      
    <Dropzone/>
    <div v-for="image in images" :key="image.id">
      <ImageRow :img="image"/>
    </div>
  </div>
</template>

<script>
import Dropzone from "./Dropzone.vue";
import ImageRow from "./ImageRow.vue";
import { mapState } from "vuex";

export default {
  name: "Sidebar",
  components: {
    Dropzone,
    ImageRow
  },
  methods: {
    updatePreset(val) {
      this.$store.commit("updatePreset", val);
    }
  },
  computed: mapState(["images", "preset", "presets"])
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
