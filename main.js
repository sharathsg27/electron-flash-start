//Import core modules to create root / life of the application

const electron = require('electron');
const path = require('path');
const url = require('url');


//Get required modules from electron to create the App, BrowserWindow or any other

const {app, BrowserWindow, Menu, ipcMain} = electron;
let mainWindow, addWindow;

//When the App is ready
app.on('ready', ()=> {

    //Create Main Window
    mainWindow = new BrowserWindow({});

    //Load rendering directory / page (index.html)
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit App when Main Window is closed
    mainWindow.on('closed', ()=> {
       app.quit();
    });

    //Build the custom Menu template to the App
    const mainMenu = Menu.buildFromTemplate(MenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});




//Handle Add Window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 200,
        height: 300,
        title: 'Add Shopping Items'
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add-window.html'),
        protocol: 'file:',
        slashes: true
    }));
}

//Listen to the render process: Add Item
ipcMain.on('item:add', (e, item)=> {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

//Create a Menu template
let MenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//Add an empty object to the Menu template for Mac
if (process.platform === 'darwin') MenuTemplate.unshift({});

//Add Dev tools if not in production
if (process.env.NODE_ENV !== 'production') {
    MenuTemplate.push({
        label: 'Developer Options',
        submenu: [
            {
                label: 'Show / Hide tools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}