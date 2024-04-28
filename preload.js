const {contextBridge, ipcRenderer} = require("electron")

// const worker = createWorker({
//   cachePath: path.join(__dirname, "lang-data"),
//   logger: (m) => console.log(m),
// });

// ipcRenderer.on("SET_SOURCE", async (event, image) => {
//   console.log(image);
//   await worker.load();
//   await worker.loadLanguage("eng");
//   await worker.initialize("eng");
//   const {
//     data: { text },
//   } = await worker.recognize(image.toPNG());
//   console.log(text);
//   await worker.terminate();
// });
contextBridge.exposeInMainWorld('electronAPI', {
    onImgFile: (callback) => ipcRenderer.on('SET_SOURCE', callback)
})
