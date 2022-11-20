const fs = require('fs')
const path = require('path')
const process = require('process');
const {colors, scenesMovies, links} = require('../config.json')
var collection = require('./template.json')


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
        collection['sources'][i]['settings']['local_file'] = path.join(process.cwd(), '..', 'movies', e['name']+'.webm')
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
        e['settings']['path'] = path.join(process.cwd(), '..','movies', 'Transition.webm')
    }
})

// Create collection
fs.writeFile('Collection-obs.json', JSON.stringify(collection), (err) => {
    if (err) throw err;
    console.log('    ~Collection create')
})