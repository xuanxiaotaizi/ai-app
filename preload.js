const { contextBridge } = require("electron/renderer");

const { ipcRenderer } = require("electron");

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
  try {
		console.log(sourceId.toDataURL())
		
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: false,
    //   video: {
    //     mandatory: {
    //       chromeMediaSource: "desktop",
    //       chromeMediaSourceId: sourceId,
    //       minWidth: 1280,
    //       maxWidth: 1280,
    //       minHeight: 720,
    //       maxHeight: 720,
    //     },
    //   },
    // });
    // handleStream(stream);
  } catch (e) {
    handleError(e);
  }
});

const handleStream = (stream) => {
	console.log(stream)
	document.body.style.opacity = "1";
	// Create hidden video tag
	let video = document.createElement("video");
	video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";
	// Event connected to stream

	let loaded = false;
	video.onloadedmetadata = () => {
		if (loaded) {
			return;
		}
		loaded = true;
		// Set video ORIGINAL height (screenshot)
		video.style.height = video.videoHeight + "px"; // videoHeight
		video.style.width = video.videoWidth + "px"; // videoWidth

		// Create canvas
		let canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		let ctx = canvas.getContext("2d");
		// Draw video on canvas
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
		console.log(canvas.toDataURL("image/png"))

		// Remove hidden video tag
		video.remove();
		try {
			stream.getTracks()[0].stop();
		} catch (e) {
			// nothing
		}
	};
	video.srcObject = stream;
	document.body.appendChild(video);
};

function handleError(err) {
	console.error(err)
}

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
