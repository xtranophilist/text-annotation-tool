<template>
  <div id="editor">
    <div id='canvas-wrapper'>
    <canvas id="canvas">
    </canvas>
    </div>
    <canvas id="tmp-canvas"></canvas>
    <div v-if="selected" id="clips">
      <div v-for="obj in selected.data.objects" :key="obj.guid">
        <img :src="obj.dataURL"/>
        <input :value="obj.text" @input="updateText(obj, $event.target.value)"/>
      </div>
    </div>
    <img id="hidden"/>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Crop from "./Crop.vue";

// import {fabric} from "fabric";

import { fabric } from "fabric-browseronly";

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

// Save additional attributes in Serialization - https://stackoverflow.com/a/40940437/328406
fabric.Annotator = fabric.util.createClass(fabric.Rect, {
  type: "annotator",

  initialize: function(element, options) {
    options || (options = {});
    this.callSuper("initialize", element, options);
    this.set("uid", options.uid || guidGenerator());
    this.set("text", options.text || "");
    this.set("dataURL", element.dataURL || "");
  },

  _render: function(ctx) {
    this.callSuper("_render", ctx);
    // var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
    // gradient.addColorStop("0", "magenta");
    // gradient.addColorStop("0.5", "blue");
    // gradient.addColorStop("1.0", "red");
    // // Fill with gradient
    // ctx.fillStyle = gradient;
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      uid: this.uid,
      text: this.text,
      dataURL: this.dataURL
    });
  }
});

fabric.Annotator.fromObject = function(object, callback) {
  fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
    delete object.objects;
    callback && callback(new fabric.Annotator(enlivenedObjects, object));
  });
};
fabric.Annotator.async = true;

window.fabric = fabric;

fabric.Group.prototype.hasControls = false;
fabric.Group.prototype.lockScalingX = true;
fabric.Group.prototype.lockScalingY = true;
fabric.Group.prototype.lockMovementX = true;
fabric.Group.prototype.lockMovementY = true;
fabric.Group.prototype.lockUniScaling = true;
fabric.Group.prototype.lockRotation = true;

export default {
  name: "Editor",
  components: { Crop },
  data() {
    return {
      hiddenImg: null,
      canvas: null,
      canvasEl: null,
      cnt: 0
    };
  },
  mounted() {
    let canvas = new fabric.Canvas("canvas");
    window.c = canvas;
    canvas.includeDefaultValues = false;
    window.onfocus = () => {
      canvas.renderAll();
    };
    this.hiddenImg = document.getElementById("hidden");
    let wrapper = document.getElementById("canvas-wrapper");
    wrapper.tabIndex = 1000;
    wrapper.addEventListener("keydown", this.keyDown, false);
    this.canvas = canvas;
  },
  methods: {
    updateText(obj, value) {
      let canvasObj = this.canvas.getObjects().find(o => o.uid == obj.uid);
      canvasObj.set("text", value);
      this.$store.commit("updateText", [obj.uid, value]);
    },
    dataURL(left, top, width, height) {
      let tmpCanvas = new fabric.Canvas("tmp-canvas");
      let img = this.hiddenImg;
      let newImage = new fabric.Image(img, {
        width: this.newWidth,
        height: this.newHeight,
        left: 0,
        top: 0
      });
      tmpCanvas.setWidth(this.newWidth);
      tmpCanvas.setHeight(this.newHeight);
      tmpCanvas.add(newImage);
      tmpCanvas.renderAll();
      let url = tmpCanvas.toDataURL({
        format: "jpg",
        quality: 1,
        left: left,
        top: top,
        width: width,
        height: height
      });
      tmpCanvas.dispose();
      return url;
    },
    update() {
      this.selected.data = this.canvas.toJSON();
    },
    keyDown(e) {
      let canvas = this.canvas;
      let activeObj = canvas.getActiveObject();
      if ((e.code == "Delete" || e.code == "Escape") && activeObj) {
        canvas.remove(activeObj);
        this.update();
      }
    },
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
      ratio = ratio * 0.7;
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
        canvas.calcOffset();
        this.listenEvents();
      });
    },
    listenEvents() {
      let start;
      let canvas = this.canvas;
      if (canvas.__eventListeners) {
        canvas.__eventListeners["mouse:down"] = [];
        canvas.__eventListeners["mouse:move"] = [];
        canvas.__eventListeners["mouse:up"] = [];
      }
      canvas.on("mouse:down", options => {
        start = canvas.getPointer(options.e);
      });
      canvas.on("mouse:up", options => {
        if (!canvas.getActiveObject() && !canvas.getActiveGroup()) {
          let end = canvas.getPointer(options.e);
          let left, top;

          if (start.x < end.x) {
            left = start.x;
          } else {
            left = end.x;
          }
          if (start.y < end.y) {
            top = start.y;
          } else {
            top = end.y;
          }

          let width = Math.abs(end.x - start.x);
          let height = Math.abs(end.y - start.y);

          if (width > 3 && height > 3) {
            let dataURL = this.dataURL(left, top, width, height);

            var rect = new fabric.Annotator({
              left: left,
              top: top,
              width: width,
              height: height,
              fill: "rgba(255,127,39,0.35)",
              dataURL: dataURL
            });

            rect.on("modified", this.update);
            canvas.add(rect);
            canvas.renderAll();
            // this.addImage()
            this.update();
          }
        }
      });
    }
  },
  watch: {
    selected() {
      let canvas = this.canvas;
      canvas.clear();
      let file = this.selected.file;
      let canvasData = this.$store.getters.getImage(this.selected.id).data;
      if (canvasData.objects) {
        canvas.loadFromJSON(canvasData, canvas.renderAll.bind(canvas), function(
          o,
          object
        ) {
          canvas.setActiveObject(object);
        });
      } else {
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
#tmp-canvas {
  visibility: hidden;
}
</style>
