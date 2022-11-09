// Modules
  const fs = require('fs')
  const tmi = require('tmi.js');
  const OBSWebSocket = require('obs-websocket-js').default;
  const obs = new OBSWebSocket();

// Get config
  const config = JSON.parse(fs.readFileSync("./config.json", "utf8"))
  const channels = config['channels']
  const colors = config['colors']
  const scenesMovies = config['scenesMovies']

// Functions
function upadteConfig() {
    fs.writeFile('config.json', JSON.stringify(config), (err) => {
        if (err) throw err;
        console.log('    ~Config.json udpate')
    })
}
function change(color) {
    console.log('  .Color changed to: '+color)
    changeAll(color)
    config['lastColor'] = color

    upadteConfig()
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
    ord[colors.indexOf(type)] = true 

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

// Tmi ~ twitch
const client = new tmi.Client({ channels });
//if (!channels) { throw new Error('!No channel has been declared') }

client.connect()
    .then((uri) => { console.log(` >. [ON] Twitch - ${uri[0]}:${uri[1]}`) })
    .catch((err) => { console.log(err) })

client.on('message', (channel, tags, message, self) => {
    if (!self) {
        var cmdSplited = message.trim().split(' ').filter(e => e)
        if (cmdSplited[0][0] == config['prefix']) {
            switch (cmdSplited[0].substring(1)) {
                case config.commands['cmdBlue']:   change('blue'); break
                case config.commands['cmdWhite']:  change('white');  break
                case config.commands['cmdPink']:   change('pink'); break
                default:
                    console.log(' .Incorrect command');
            }
        }
    }
})

// Obs
obs.connect('ws://127.0.0.1:4455', config['password'], { rpcVersion: 1 })
  .then(({obsWebSocketVersion, negotiatedRpcVersion}) => {
    console.log(` >. [ON] Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
    changeAll(config['lastColor'])
  })
  .catch((err) => { console.error('Failed to connect', err.code, err.message); })

