const movie = window.document.querySelector('div.image-container video')
  const name  = window.document.querySelector('.box-name')
  const bar   = window.document.querySelector('.bar')
  var timeDuration = {{alertDuration}} - 2 || 6 // min 6 seconds
  console.log(timeDuration)
  function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)) }

  console.log(window.document.querySelector('.image-container'))
  async function main() {
    //Close items
    setTimeout(()=> {
        name.style.opacity = 0
        bar.style.opacity = 0
    }, timeDuration*1000 - 500)
    
    await sleep(1250)
    name.style.opacity = 1
    bar.style.opacity = 1
    await sleep(750)
    
    await sleep(2500)
    movie.pause()
    await sleep(timeDuration*1000 - 6000)
    movie.play()
  }
  main();