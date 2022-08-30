const show = {
	blue: () => {
        	window.document.querySelector('#blue').style.display = 'block'
		window.document.querySelector('#white').style.display = 'none'
		window.document.querySelector('#pink').style.display = 'none'
	},
	white: () => {
		window.document.querySelector('#blue').style.display = 'none'
		window.document.querySelector('#white').style.display = 'block'
		window.document.querySelector('#pink').style.display = 'none'
	},
	pink: () => {
		window.document.querySelector('#blue').style.display = 'none'
		window.document.querySelector('#white').style.display = 'none'
		window.document.querySelector('#pink').style.display = 'block'
	}
}

const socket = io('http://localhost:3000', { transports : ['websocket'] })
socket.on('connect', () => {
	console.log('connect')
});

socket.on('change_blue', () => { show.blue() })
socket.on('change_white', () => { show.white() })
socket.on('change_pink', () => { show.pink() })

socket.emit('get_color')
	socket.on('get_res', (data) => {
	console.log(data)
	switch(data) {
		case 'blue': show.blue(); break
		case 'white': show.white(); break
		case 'pink': show.pink(); break
	}
})