const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  screen,
} = require("electron");
const electronPackager = require("electron-packager");

let mainWindow;

const fs = require("fs");

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Autoshkolla",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const menu = [];

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  globalShortcut.register("Ctrl+R", () => {
    mainWindow.reload();
  });

  mainWindow.loadFile("./client/index.html");
  mainWindow.setFullScreen(true);
};

app.on("ready", () => {
  createMainWindow();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
