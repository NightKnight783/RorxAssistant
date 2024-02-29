const getMedal = (i) => {
  switch (i) {
    case 1:
      return ':first_place: '
    case 2:
      return ':second_place: '
    case 3:
      return ':third_place: '
    default:
      return `#${i}`
  }
}

module.exports = {
  getMedal
}
