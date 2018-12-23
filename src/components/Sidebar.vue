<template>
  <div class="sidebar">
    <!-- <h1>OCR GT</h1> -->
    <!-- {{presets}} -->
    <div class="header">
    <div>
    Preset: <select @change="updatePreset($event.target.value)" :value="preset">
      <option value="">None</option>
      <option v-for="(value, key) in presets" :key="key">{{key}}</option>
    </select>
    </div>
    <a href="#" @click.prevent="clearFiles">Clear</a>
    <a href="#" @click.prevent="download">Export</a>
    <div>
    <input id="localImport" type="file" @change="importLocal" class="hidden" />
    <input type="button" value="Import" onclick="document.getElementById('localImport').click();" />
    </div>
    <div>{{usage}}/{{quota}} GB</div>
    </div>
    <hr/>
    <div v-for="image in enabledImages" :key="image.id">
      <ImageRow :img="image"/>
    </div>
    <Dropzone/>
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
      quota: 0,
      usage: 0
    };
  },
  created() {
    // this.$store.watch(state => state, this.handleStateUpdate, {deep: true});
    this.handleStateUpdate();
  },
  methods: {
    importLocal(e) {
      let file = e.target.files[0];
      let read = new FileReader();
      read.readAsBinaryString(file);
      read.onloadend = () => {
        let data = JSON.parse(read.result);
        this.$store.commit("updateState", data);
      };
    },
    clearFiles() {
      this.$store.commit("clearFiles");
    },
    updatePreset(val) {
      this.$store.commit("updatePreset", val);
    },
    download() {
      let a = document.createElement("a");
      let stateData = JSON.stringify(this.$store.state);
      a.href = "data:text/plain," + stateData;
      a.download = new Date().toISOString() + ".txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    handleStateUpdate() {
      navigator.storage.estimate().then(data => {
        this.usage = (data.usage / (1024 * 1024 * 1024)).toFixed(2);
        this.quota = (data.quota / (1024 * 1024 * 1024)).toFixed(2);
      });
    }
  },
  computed: {
    ...mapState(["images", "preset", "presets"]),
    ...mapGetters(["enabledImages"])
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
h1 {
  margin: 5px 0;
}
.hidden {
  display: none !important;
}
.header * {
  display: inline-block;
  padding: 0 0.2em;
}
</style>
