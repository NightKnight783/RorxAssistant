const fs = require('fs')

const load = () => {
  try {
    const rawdata = fs.readFileSync('cardBank/data.json')
    const data = JSON.parse(rawdata)

    return data
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  load
}
