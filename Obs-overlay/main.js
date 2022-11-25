// Modules
const path = require('path')
const fs = require('fs')
var collection = require('./template.json')
var pathMain = path.extname(__dirname) == '.asar' ? path.dirname(__dirname) : __dirname

const tmi = require('tmi.js');
const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();

function createCollection(outFile) {
  const links = config['links']
    var modifyScenes = [
      'Webcam'
  ]
  scenesMovies.forEach(e => {
      colors.forEach(c => {
          modifyScenes.push(e+'-'+c)
      })
  })


  // Modify sources Media
  collection['sources'].forEach((e, i) => {
      if ( modifyScenes.indexOf(e['name']) >= 0 ) {
          collection['sources'][i]['settings']['local_file'] = path.join(pathMain, 'movies', e['name']+'.webm')
      }
  })
  // Modify sources browser
  collection['sources'].forEach((e, i) => {
      if ( e['name'] == 'Alert' && links['Alert'] !== '') {
          collection['sources'][i]['settings']['url'] = links['Alert']
      }
      if ( e['name'].split('-')[0] == 'Chat' && links['Chat'] !== '') {
          collection['sources'][i]['settings']['url'] = links['Chat']
      }
  })
  // Modify transition
  collection['transitions'].forEach(e => {
      if ( e['name'] == 'Transição animada' ) {
          e['settings']['path'] = path.join(pathMain,'movies', 'Transition.webm')
      }
  })

  fs.writeFile(path.join(pathMain, outFile), JSON.stringify(collection), (err) => {
      if (err) throw err;
      console.log('    ~Collection create')
  })
}

  // Get config
  const config_pathName = path.join(pathMain, "config.json")
  var config = JSON.parse(fs.readFileSync(config_pathName, "utf8"))
  const colors = config['colors']
  const scenesMovies = config['scenesMovies']

  var client;
  //if (!channels) { throw new Error('!No channel has been declared') }

  
  // Functions
  function upadteConfig() {
    fs.writeFile(config_pathName, JSON.stringify(config), (err) => {
        if (err) throw err;
        logger('    ~Config.json udpate')
    })
  }
  function change(color) {
    logger('  .Color changed to: '+color)
    changeAll(color)
    config['lastColor'] = color

    upadteConfig()
  }

const { app, BrowserWindow, nativeImage, ipcMain } = require("electron");
var listlogger = []
function logger (msg) {
  listlogger.push(msg)
  console.log(msg)
}


function mainApp() {
  // require("electron-reload")(__dirname, {
  //   electron: require(`${__dirname}/node_modules/electron`),
  // });
  // win.webContents.openDevTools();

  
  
  // Função que cria uma janela desktop
  function createWindow() {
    // Adicionando um ícone na barra de tarefas/dock
    const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`);
  
    if (app.dock) {
      app.dock.setIcon(icon);
    }
  
    // Cria uma janela de desktop
    const win = new BrowserWindow({
      icon,
      width: 550,
      height: 900,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      resizable: false
    });
  
    win.loadFile("public/index.html");
  }
  
  app.whenReady().then(createWindow);
  
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") { app.quit(); }
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
  });
  
  
  ipcMain.handle('logger', (e) => {
    let list = listlogger
    listlogger = []
    return list
  })
  ipcMain.handle('getConfig', (e) => {
    return config
  })
  ipcMain.handle('changeConfig', (e, dataJSON) => {
    config['channels'] = [dataJSON.name]
    config['password'] = dataJSON.pass
    config['prefix'] = dataJSON.prefix
    config['commands']['cmdBlue'] = dataJSON.cmdBlue
    config['commands']['cmdWhite'] = dataJSON.cmdWhite
    config['commands']['cmdPink'] = dataJSON.cmdPink
    config['links']['Alert'] = dataJSON.linkAlert
    config['links']['Chat'] = dataJSON.linkChat

    upadteConfig()
  })
  ipcMain.handle('createCollection', (e) => {
    createCollection('Collection-obs.json')
  })
  ipcMain.handle('restart', (e) => {
    reconnect()
  })
}

// --------------------------------------------

async function start() {
  logger(' >. CONNECT APPLICATIONS ')

  // Tmi ~ twitch
  client = new tmi.Client({ channels: config['channels'] });
  client.connect()
    .then((uri) => { logger(` >. [ON] Twitch - ${uri[0]}:${uri[1]}`) })
    .catch((err) => { logger(err) })

  client.on('message', (channel, tags, message, self) => {
    if (!self) {
        var cmdSplited = message.trim().split(' ').filter(e => e)
        if (cmdSplited[0][0] == config['prefix']) {
            switch (cmdSplited[0].substring(1)) {
                case config.commands['cmdBlue']:   change('blue'); break
                case config.commands['cmdWhite']:  change('white');  break
                case config.commands['cmdPink']:   change('pink'); break
                default:
                  logger(' .Incorrect command');
            }
        }
    }
  })

  // Obs
  obs.connect('ws://127.0.0.1:4455', config['password'], { rpcVersion: 1 })
  .then(({obsWebSocketVersion, negotiatedRpcVersion}) => {
    logger(` >. [ON] Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
    changeAll(config['lastColor'])
  })
  .catch((err) => { logger('Failed to connect'+err.code+err.message); })
}
async function reconnect() {
  logger(' >. DISCONNECT APPLICATIONS ')
  try {
    await obs.disconnect()
    logger(' >. [OFF] Obs disconnect')
    
    const uri = await client.disconnect()
    logger(` >. [OFF] Twitch - ${uri[0]}:${uri[1]}`)
    client = undefined
  } catch (err) { logger(err) }
  finally {
    start()
  }
}
// Obs ----------------------
async function changeAll(type) {
  const {scenes} = await obs.call('GetSceneList');
  scenes.forEach(async (e) => {
    if (scenesMovies.indexOf(e['sceneName']) >= 0) { 
      let sceneItemsIds =  await getId(e['sceneName'])
      await changeOne(type, e['sceneName'], sceneItemsIds)
    }
  })
}

async function changeOne(type, sceneName, sceneItemsIds) {
  ord = colors.map(() => false)
  ord[ colors.indexOf(type) ] = true 

  SetSceneItemEnabled = []

  colors.forEach((e, i) => {
    SetSceneItemEnabled.push(
      { requestType: 'SetSceneItemEnabled',
        requestData: { sceneName: sceneName, sceneItemId: sceneItemsIds[i], sceneItemEnabled: ord[i] }
      }
    )
  })

  await obs.callBatch(SetSceneItemEnabled)
}
async function getId(sceneName) {
  GetSceneItemId = []

  colors.forEach((e, i) => {
    GetSceneItemId.push(
      { requestType: 'GetSceneItemId',
        requestData: { sceneName: sceneName, sourceName: sceneName+'-'+colors[i] }
      }
    )
  })

  let response = await obs.callBatch(GetSceneItemId)
  return response.map((e) => e['responseData']['sceneItemId'] )
}
try {
  start()
  mainApp()
} catch (err) {  logger(err) }