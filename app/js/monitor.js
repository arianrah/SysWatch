const path = require('path')

const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os

// static info
// get cpu model
document.getElementById('cpu-model').innerText = cpu.model()

// get comp name
document.getElementById('comp-name').innerText = os.hostname()

// os type
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// get total mem
mem.info().then(info => {
  document.getElementById('mem-total').innerText = info.totalMemMb
})

let cpuOverload = 80

// refresh every 2 seconds
setInterval(() => {

  // cpu usage
  cpu.usage().then(info => {
    document.getElementById('cpu-usage').innerText = info + '%'

    document.getElementById('cpu-progress').style.width = info + '%'

    // progress red if overload
    if(info > cpuOverload) {
      document.getElementById('cpu-progress').style.background = 'red'
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b'
    }
  })

  // cpu free
  cpu.free().then(info => {
    document.getElementById('cpu-free').innerText = info + '%'
  })

  // uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime())

}, 2222)

function secondsToDhms(secs) {
  secs = +secs
  const d = Math.floor(secs/(3600*24))
  const h = Math.floor((secs%(3600*24))/3600)
  const m = Math.floor((secs%3600)/60)
  const s = Math.floor(secs%60)
  return `${d}d, ${h}h, ${m}m, ${s}s`
}
