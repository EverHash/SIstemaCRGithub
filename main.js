const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')

const createWindow = () =>{
    const window = new BrowserWindow({
        width: 800,
        height: 600
    })
    //window.removeMenu();
    window.loadFile('scrn/login.html');
}

app.whenReady().then(() =>{
    createWindow();
})
