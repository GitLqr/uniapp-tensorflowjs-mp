<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

import { fetchFunc } from "fetch-wechat";
import * as tf from "@tensorflow/tfjs-core";
import * as webgl from "@tensorflow/tfjs-backend-webgl";
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";
const plugin = requirePlugin("tfjsPlugin");

const ENABLE_DEBUG = false;

const usePlatformFetch = true;
setWasmPaths(
  {
    "tfjs-backend-wasm.wasm": "/static/tfjs-backend-wasm.wasm",
    "tfjs-backend-wasm-simd.wasm": "/static/tfjs-backend-wasm.wasm",
    "tfjs-backend-wasm-threaded-simd.wasm": "/static/tfjs-backend-wasm.wasm",
  },
  usePlatformFetch
);

onLaunch(() => {
  console.log("App Launch");
  initTfjs();
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});

async function initTfjs() {
  plugin.configPlugin(
    {
      // polyfill fetch function
      fetchFunc: fetchFunc(),
      // inject tfjs runtime
      tf,
      // inject webgl backend
      webgl,
      // provide webgl canvas
      canvas: uni.createOffscreenCanvas({}),
      // backendName: "wechat-webgl-" + Date.now(),
    },
    ENABLE_DEBUG
  );

  await tf.setBackend("wasm");
  console.log(tf.getBackend()); // wasm
  tf.tensor([1, 2, 3, 4]).print(); // Tensor [1, 2, 3, 4]

  await tf.setBackend("wechat-webgl");
  console.log(tf.getBackend()); // wechat-webgl
  tf.tensor([1, 2, 3, 4]).print(); // Tensor [1, 2, 3, 4]
}
</script>
<style></style>
