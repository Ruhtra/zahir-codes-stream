// Modules
    const fs = require('fs')
    const path = require('path')
    const tmi = require('tmi.js');
    // Get config
    //var config;
	const config = JSON.parse(fs.readFileSync("./config.json", "utf8"))
        const PORT = config['PORT'] || 8080
        const channels = config['channels']
    // Create Server
        const express = require("express")
        const app = express()
        const server = require('http').createServer(app)

// Start tmi ~ twitch

// Config server
    app.use(express.static('public'))

    // Socket.io
        const io = require('socket.io')(server)
        io.sockets.on('connection', (socket) => {
            socket.on('get_color', () => {
                io.sockets.emit('get_res', config['lastColor'])
            })
        })


// Functions
    function upadteConfig() {
        fs.writeFile('config.json', JSON.stringify(config), (err) => {
            if (err) throw err;
            console.log('    ~Config.json udpate')
        })
    }
    function change(color) {
        console.log('  .Color changed to: '+color)
        io.sockets.emit('change_'+color)
        config['lastColor'] = color

        upadteConfig()
    }

// Tmi ~ twitch
    const client = new tmi.Client({ channels });
    if (!channels) { throw new Error('!No channel has been declared') }

    client.connect()
        .then((uri) => { console.log(` >. [ON] Twitch - ${uri[0]}:${uri[1]}`) })
        .catch((err) => { console.log(err) })

    client.on('message', (channel, tags, message, self) => {
        if (!self) {
            var cmdSplited = message.trim().split(' ').filter(e => e)
            if (cmdSplited[0][0] == '!') {
                switch (cmdSplited[0].substring(1)) {
                    case 'blue':   change('blue'); break
                    case 'white':  change('white');  break
                    case 'pink':   change('pink'); break
                    default:
                        console.log(' .Incorrect command');
                }
            }
        }
    })

// Routes
    app.use('/javolto', (req, res) => {
        return res.sendFile(path.join(__dirname, 'html/javolto.html'))
    })
    app.use('/intermission', (req, res) => {
	return res.sendFile(path.join(__dirname, 'html/intermission.html'))
    })
    app.use('/mobile', (req, res) => {
	return res.sendFile(path.join(__dirname, 'html/mobile.html'))
    })
    app.use('/start', (req, res) => {
	return res.sendFile(path.join(__dirname, 'html/start.html'))
    })
    app.use('/justchatting', (req, res) => {
	return res.sendFile(path.join(__dirname, 'html/justchatting.html'))
    })


server.listen(PORT, () => {
    console.log(` >. Running in ${PORT}`)
})