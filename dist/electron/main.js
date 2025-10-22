import { app, BrowserWindow } from "electron";
import * as path from "path";
const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const startURL = process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : `file://${path.join(__dirname, "../out/index.html")}`;
    await win.loadURL(startURL);
};
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
