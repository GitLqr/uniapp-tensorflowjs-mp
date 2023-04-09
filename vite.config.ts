import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [uni()],
  plugins: [uni(), codeTransform()],
});

function codeTransform() {
  return {
    name: "codeTransform",
    transform(code, file) {
      // 修复wasm
      if (
        file.endsWith("tfjs-backend-wasm-threaded-simd.worker.js") ||
        file.endsWith("tfjs-backend-wasm-threaded-simd.js")
      ) {
        code = code.replace(`require("worker_threads")`, "null");
        code = code.replace(`require("perf_hooks")`, "null");
      }
      if (file.endsWith("backend_wasm.js")) {
        code = code.replace(`env().getAsync('WASM_HAS_SIMD_SUPPORT')`, "false");
        code = code.replace(
          `env().getAsync('WASM_HAS_MULTITHREAD_SUPPORT')`,
          "false"
        );
        code = code.replace(
          `return (imports, callback) => {`,
          `return (imports, callback) => {
            WebAssembly.instantiate(path, imports).then(output => {
                callback(output.instance, output.module);
            });
            return {};`
        );
      }
      code = code.replace(`WebAssembly.`, `WXWebAssembly.`);
      code = code.replace(`typeof WebAssembly`, `typeof WXWebAssembly`);
      return { code };
    },
  };
}
