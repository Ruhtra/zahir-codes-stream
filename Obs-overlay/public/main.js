console.log(" ---> Lendo o arquivo todos.js");


const log    = document.querySelector('section.log div#log > div')
const screen = document.querySelector('section.screen')

function insert(msg) {
    log.innerHTML += `<div class='msg'>${msg}</div>`
}


const config = {
    open: () => {
        getConfig()
        screen.style.display = 'flex'
    },
    close: () => {
        screen.style.display = 'none'
    },
    okay: () => {
        dataJSON = getInputs()
        changeConfig(dataJSON)
        config.close()
    }
}
function getInputs() {
    return {
        name: document.querySelector('input[name="name"]').value,
        pass: document.querySelector('input[name="pass"]').value,


        prefix: document.querySelector('input[name="prefix"]').value,
        cmdBlue: document.querySelector('input[name="blue"]').value,
        cmdWhite: document.querySelector('input[name="white"]').value,
        cmdPink: document.querySelector('input[name="pink"]').value,

        
        linkAlert: document.querySelector('input[name="alert"]').value,
        linkChat: document.querySelector('input[name="chat"]').value
    }
}
function insertInputs(data) {
    document.querySelector('input[name="name"]').value = data.channels[0]
    document.querySelector('input[name="pass"]').value = data.password

    document.querySelector('input[name="prefix"]').value = data.prefix
    document.querySelector('input[name="blue"]').value = data.commands['cmdBlue']
    document.querySelector('input[name="white"]').value = data.commands['cmdWhite']
    document.querySelector('input[name="pink"]').value = data.commands['cmdPink']

    
    document.querySelector('input[name="alert"]').value = data.links['Alert']
    document.querySelector('input[name="chat"]').value = data.links['Chat']
}
const getConfig = async () => {
    const response = await versions.getConfig()
    insertInputs(response)
}
const changeConfig = async (data) => {
    await versions.changeConfig(data)
}
const restart = async () => {
    await versions.restart()
}

const logger = async () => {
    const response = await versions.logger()
    response.forEach(e => {
        insert(e)
    });
}
const createCollection = async () => {
    await versions.createCollection()
}
setInterval(logger, 1000)