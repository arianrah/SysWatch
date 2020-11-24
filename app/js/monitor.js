const path = require('path')
const { ipcRenderer } = require('electron')

const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os

let cpuOverload
let alertFrequency

// get settings, values
ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverload = +settings.cpuOverload,
  alertFrequency = +settings.alertFrequency
})
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

// refresh every 2 seconds
setInterval(() => {

  // cpu usage
  cpu.usage().then(info => {
    document.getElementById('cpu-usage').innerText = info + '%'

    document.getElementById('cpu-progress').style.width = info + '%'

    // progress red if overload
    if(info >= cpuOverload){
      document.getElementById('cpu-progress').style.background = 'red'
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b'
    }

    if(info >= cpuOverload && runNotify(alertFrequency)){
      notifyUser({
        title: 'CPU Overload',
        body: `CPU is above ${cpuOverload}% usage.`,
        icon: path.join(__dirname, 'img', 'icon.png')
      })

      localStorage.setItem('lastNotify', +new Date())
    }
  })

  // cpu free
  cpu.free().then(info => {
    document.getElementById('cpu-free').innerText = info + '%'
  })

  // uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime())

}, 2222)

// notification handler
function notifyUser(options) {
  new Notification(options.title, options)
}

// check last notification ran
function runNotify(frequency) {
  if(localStorage.getItem('lastNotify') === null){
    // if null store timestamp
    localStorage.setItem('lastNotify', +new Date)
    return true
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
  const now = new Date()
  const diffTime = Math.abs(now - notifyTime)
  const minutesPassed = Math.ceil(diffTime/(1000*60))

  if(minutesPassed > frequency) {
    return true
  } else {
    return false
  }
}

function secondsToDhms(secs) {
  secs = +secs
  const d = Math.floor(secs/(3600*24))
  const h = Math.floor((secs%(3600*24))/3600)
  const m = Math.floor((secs%3600)/60)
  const s = Math.floor(secs%60)
  return `${d}d, ${h}h, ${m}m, ${s}s`
}
