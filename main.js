const {
  app,
  BrowserWindow,
  desktopCapturer,
	clipboard,
  Menu,
  MenuItem,
} = require("electron/main");
const path = require("node:path");
const exec = require("child_process").exec
app.commandLine.appendSwitch('disable-web-security');

let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.openDevTools();

  win.loadFile("index.html");
};

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "Electron",
    submenu: [
      {
        role: "help",
        accelerator:
          process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+A",
        click: () => {
          // desktopCapturer
          //   .getSources({
          //     types: ["screen"],
          //     thumbnailSize: { width: 1000, height: 1000 },
          //   })
          //   .then(async (sources) => {
          //     win.webContents.send("SET_SOURCE", sources[0]);
          //   });

					screenWindow()
        },
      },
    ],
  })
);

Menu.setApplicationMenu(menu);

function screenWindow() {
  let url = path.resolve(__dirname, './exe/ScreenCapture.exe')
	let screenWindow  = exec(url, (err, stdout, stderr) => {
		if (err) {
			console.log(err)
		};
	
		const image = clipboard.readImage();
		win.webContents.send("SET_SOURCE", image);
		
	})
  screenWindow.on('exit', (code) => {
    win.restore()
    if (code) console.log(code)
  })
}
function handleScreenShots() {
  exec(`screencapture -i -U -c`, (error, stdout, stderr) => {
    console.log('308', error)
  })
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
