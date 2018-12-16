<template>
  <div id="editor">
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
      start: [],
      hiddenImg: null,
      canvas: null
    };
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas");
    this.hiddenImg = document.getElementById("hidden");
  },
  methods: {
    setDimensions() {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      let editor = document.getElementById("editor");
      let widthRatio = editor.clientWidth / hiddenImg.width,
        heightRatio = editor.clientHeight / hiddenImg.height;
      let ratio;
      if (widthRatio < heightRatio) {
        ratio = widthRatio;
      } else {
        ratio = heightRatio;
      }
      if (ratio > 10) {
        ratio = 10;
      }
      (this.newWidth = hiddenImg.width * ratio),
        (this.newHeight = hiddenImg.height * ratio);
      canvas.setWidth(this.newWidth);
      canvas.setHeight(this.newHeight);
    },
    lock_object(obj) {
      obj.lockMovementX = true;
      obj.lockMovementY = true;
      obj.lockScalingX = true;
      obj.lockScalingY = true;
      obj.lockUniScaling = true;
      obj.lockRotation = true;
      obj.hasControls = false;
      return obj;
    },
    addImage(data) {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      this.setDimensions();
      fabric.Image.fromURL(data, img => {
        img = img.set({
          width: this.newWidth,
          height: this.newHeight
        });
        // img = this.lock_object(img)
        canvas.setBackgroundImage(img).renderAll();
        this.listenEvents();
      });
    },
    listenEvents() {
      let start;
      this.canvas.on("mouse:down", options => {
        start = [options.e.layerX, options.e.layerY];
      });
      this.canvas.on("mouse:up", options => {
        let end = [options.e.layerX, options.e.layerY];
        console.log(start)
      });
    }
  },
  watch: {
    selected() {
      let canvas = this.canvas;
      canvas.clear();
      let file = this.selected.file;
      let reader = new FileReader();
      reader.onload = f => {
        var data = f.target.result;
        this.hiddenImg.onload = () => {
          this.addImage(data);
        };
        this.hiddenImg.src = data;
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
  z-index: -1;
}
</style>
