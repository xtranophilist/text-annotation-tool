<template>
  <div id="editor">
    <h2>Editor</h2>
    {{selected}}
    <canvas id="canvas">
    </canvas>
    <img id="hidden"/>
  </div>
</template>

<script>
import { mapState } from "vuex";

// import {fabric} from "fabric";

import { fabric } from "fabric-browseronly";
window.fabric = fabric;

export default {
  name: "Editor",
  data() {
    return {
      // canvas: null,
      // hiddenImg: null
    };
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas");
    this.hiddenImg = document.getElementById("hidden");
  },
  methods: {
    renderImage(data) {
      let canvas = this.canvas;
      width = this.hiddenImg.width;
      height = this.hiddenImg.height;
      

      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.calcOffset();
    },
    addImage(data) {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      hiddenImg.src = data;
      fabric.Image.fromURL(data, function(img) {
        var oImg = img.set({
          left: 0,
          top: 0,
          angle: 0,
          width: hiddenImg.width,
          height: hiddenImg.height
        });
        canvas.add(oImg).renderAll();
        var a = canvas.setActiveObject(oImg);
        var dataURL = canvas.toDataURL({ format: "png", quality: 1 });
      });
    }
  },
  watch: {
    selected() {
      let canvas = this.canvas;
      let file = this.selected.file;
      
      var reader = new FileReader();
      reader.onload = f => {
        var data = f.target.result;
        this.addImage(data);
      };
      reader.readAsDataURL(file);
    }
  },

  computed: {
    ...mapState(["selected"])
  }
};
</script>


<style>
#canvas {
  border: 1px solid red;
}
#hidden {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>
