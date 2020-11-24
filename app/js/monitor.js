const path = require('path')

const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os


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