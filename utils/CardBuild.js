const { AttachmentBuilder, EmbedBuilder, Colors, VoiceState } = require('discord.js')
const emojis = require('../emojis.json')

const getColor = (color) => {
  switch (color.toLowerCase()) {
    case 'iron':
      return Colors.Orange
    case 'steel':
      return Colors.Grey
    case 'titanium':
      return Colors.Yellow
    case 'shadow':
      return Colors.Purple
    default:
      return Colors.Orange
  }
}

const getTarget = (target) => {
  switch (target.toLowerCase()) {
    case 'enemies':
      return 'Affecte les ennemies'
    case 'ally':
      return 'Affecte les alliés'
    case 'single ally':
      return 'Affecte un seul allié'
    case 'single enemy':
      return 'Affecte un seul ennemie'
    case 'all enemies':
      return 'Affecte tous les ennemies'
    case 'allies':
      return 'Affecte tous les alliés'
    case 'all':
      return 'Affecte tout le monde'
    default:
      return '\u200b'
  }
}

const getRobotEffect = (cardRobot) => {
  const list = []

  if (cardRobot.Aquatic) { list.push('Aquatique') }
  if (cardRobot.Earthly) { list.push('Terrestre') }
  if (cardRobot.Flying) { list.push('Aérien') }
  if (cardRobot.Devastation) { list.push('Dévastation') }
  if (cardRobot.Affinity) { list.push('Affinitée') }
  if (cardRobot.Tinker) { list.push('Stoïcisme') }
  if (cardRobot.Protection) { list.push('Protection') }
  if (cardRobot.Celerity) { list.push('Esquive') }
  if (cardRobot.Melee) { list.push('Mélée') }

  let i = true
  let effects = ''
  list.forEach(e => {
    if (i) {
      effects = e
      i = false
    } else { effects += ', ' + e }
  })

  return effects
}

const getStatsField = (cardRobot) => {
  const hp = `${emojis.hp} ${cardRobot.Health}`
  const speed = `${emojis.speed} ${cardRobot.Speed}`

  const damage = `${emojis.damage} ${cardRobot.Damage}`
  const resilience = `${emojis.resilience} ${cardRobot.Resilience}`

  const aim = `${emojis.aim} ${cardRobot.Aim}`
  const armor = `${emojis.armor} ${cardRobot.Armor}`

  const move = `${emojis.move} ${cardRobot.Move}`
  const range = `${emojis.range} ${cardRobot.Range}`

  const line1 = `${hp}\t${speed}`
  const line2 = `${damage}\t${resilience}`

  const line3 = `${aim}\t${armor}`
  const line4 = `${move}\t${range}`

  return {
    name: `${line1}\n${line2}`,
    value: `**${line3}\n${line4}**`
  }
}

const BuildRobotCard = (cardRobot, author, index = null, length = null) => {
  const file = new AttachmentBuilder('card_bank/Robots/' + cardRobot.ID + '.png')
  file.name = cardRobot.ID + '.png'
  const embed = new EmbedBuilder()
    .setColor(getColor(cardRobot.Rarity))
    .setAuthor(author)
    .setTitle(cardRobot.Name)
    .setDescription(cardRobot.Family + '\nCoût: ' + cardRobot.Cost + ' ' + emojis.kit + '\n')
    .setThumbnail(`attachment://${file.name}`)
    .addFields(getStatsField(cardRobot))

  const effects = getRobotEffect(cardRobot)

  if (effects) {
    embed.addFields({
      name: 'Capacitée(s):',
      value: `*${effects}*`
    })
  }

  if (cardRobot['Special ability']) {
    embed.addFields({
      name: 'Effet unique:',
      value: `*${cardRobot['Special ability']}*`
    })
  }

  if (index != null && length != null) {
    embed.setFooter({
      text: 'Carte ' + (index + 1) + ' / ' + length
    })
  }

  return {
    embeds: [embed],
    files: [file]
  }
}

const getGivingStat = (card) => {
  let str = ''
  if (card.Damage) {
    str = str + (card.Damage > 0 ? '+' : '') + card.Damage + ' ' + emojis.damage + '\n'
  }
  if (card.Aim) {
    str = str + (card.Aim > 0 ? '+' : '') + card.Aim + ' ' + emojis.aim + '\n'
  }
  if (card.Speed) {
    str = str + (card.Speed > 0 ? '+' : '') + card.Speed + ' ' + emojis.speed + '\n'
  }
  if (card.Health) {
    str = str + (card.Health > 0 ? '+' : '') + card.Health + ' ' + emojis.hp + '\n'
  }
  if (card.Healing) {
    str = str + (card.Healing > 0 ? '+' : '') + card.Healing + ' ' + emojis.hp + '\n'
  }
  if (card.MaxHealth) {
    str = str + (card.MaxHealth > 0 ? '+' : '') + card.MaxHealth + ' ' + emojis.hp + '\n'
  }
  if (card['Health reduction']) {
    str = str + '-' + card['Health reduction'] + ' ' + emojis.hp + '\n'
  }
  if (card.Armor) {
    str = str + (card.Armor > 0 ? '+' : '') + card.Armor + ' ' + emojis.armor + '\n'
  }
  if (card.Resilience) {
    str = str + (card.Resilience > 0 ? '+' : '') + card.Resilience + ' ' + emojis.resilience + '\n'
  }
  if (card.Range) {
    str = str + (card.Range > 0 ? '+' : '') + card.Range + ' ' + emojis.range + '\n'
  }
  if (card.Move) {
    str = str + (card.Move > 0 ? '+' : '') + card.Move + ' ' + emojis.move + '\n'
  }
  if (card['Health/round']) {
    str = str + (card['Health/round'] > 0 ? '+' : '') + card['Health/round'] + ' ' + emojis.hp + '/R' + '\n'
  }
  if (card['Kit/Round']) {
    str = str + (card['Kit/Round'] > 0 ? '+' : '') + card['Kit/Round'] + ' ' + emojis.kit + '/R' + '\n'
  }
  if (card.Kit) {
    str = str + (card.Kit > 0 ? '+' : '') + card.Kit + ' ' + emojis.kit + '\n'
  }
  if (card['Energy/Round']) {
    str = str + (card['Energy/Round'] > 0 ? '+' : '') + card['Energy/Round'] + ' ' + emojis.energy + '/R' + '\n'
  }
  if (card.Energy) {
    str = str + (card.Energy > 0 ? '+' : '') + card.Energy + ' ' + emojis.energy + '\n'
  }
  if (card.Affinity) {
    str = str + (card.Affinity > 0 ? '+' : '-') + 'affinité\n'
  }
  if (card.Stoicism) {
    str = str + (card.Stoicism > 0 ? '+' : '-') + 'stoïcisme\n'
  }
  if (card.Dodge) {
    str = str + (card.Dodge > 0 ? '+' : '-') + 'esquive\n'
  }
  if (card.Devastation) {
    str = str + (card.Devastation > 0 ? '+' : '-') + 'dévastation\n'
  }
  if (card.Melee) {
    str = str + (card.Melee > 0 ? '+' : '-') + 'mélée\n'
  }
  if (card.Protection) {
    str = str + (card.Protection > 0 ? '+' : '-') + 'protection\n'
  }

  if (!str) {
    str = '\u200b'
  }

  return str
}

const BuildMasteryCard = (cardMastery, author, index = null, length = null) => {
  const file = new AttachmentBuilder('card_bank/Masteries/' + cardMastery.ID + '.jpg')
  file.name = cardMastery.ID + '.jpg'
  const embed = new EmbedBuilder()
    .setColor(getColor(cardMastery.Rarity))
    .setAuthor(author)
    .setTitle(cardMastery.Name)
    .setThumbnail(`attachment://${file.name}`)
    .setDescription(cardMastery.Family + '\nCoût: ' + cardMastery.Cost + ' ' + emojis.energy + '\nCooldown: ' + cardMastery.CD)

  const stat = getGivingStat(cardMastery)
  if (stat !== '\u200b') {
    embed.addFields({
      name: 'Stats données',
      value: stat
    })
  }

  if (cardMastery['Special Ability']) {
    let ability = cardMastery['Special Ability']
    ability = ability.replace('damage', emojis.damage)
    ability = ability.replace('Damage', emojis.damage)
    ability = ability.replace('aim', emojis.aim)
    ability = ability.replace('Aim', emojis.aim)
    ability = ability.replace('speed', emojis.speed)
    ability = ability.replace('Speed', emojis.speed)
    ability = ability.replace('hp', emojis.hp)
    ability = ability.replace('health', emojis.hp)
    ability = ability.replace('Hp', emojis.hp)
    ability = ability.replace('Health', emojis.hp)
    ability = ability.replace('armor', emojis.armor)
    ability = ability.replace('Armor', emojis.armor)
    ability = ability.replace('resilience', emojis.resilience)
    ability = ability.replace('Resilience', emojis.resilience)
    ability = ability.replace('range', emojis.range)
    ability = ability.replace('Range', emojis.range)
    ability = ability.replace('move', emojis.move)
    ability = ability.replace('Move', emojis.move)
    ability = ability.replace('kits', 'kit')
    ability = ability.replace('Kits', 'Kit')
    ability = ability.replace('kit', emojis.kit)
    ability = ability.replace('Kit', emojis.kit)
    ability = ability.replace('energy', emojis.energy)
    ability = ability.replace('Energy', emojis.energy)
    embed.addFields({
      name: 'Effet unique:',
      value: `*${ability}*`
    })
  }

  if (cardMastery.Targets && cardMastery.Targets !== 'None') {
    embed.addFields({
      name: getTarget(cardMastery.Targets),
      value: '\u200b'
    })
  } else if (cardMastery.Target && cardMastery.Target !== 'None') {
    embed.addFields({
      name: getTarget(cardMastery.Target),
      value: '\u200b'
    })
  }

  if (index != null && length != null) {
    embed.setFooter({
      text: 'Carte ' + (index + 1) + ' / ' + length
    })
  }

  return {
    embeds: [embed],
    files: [file]
  }
}

const BuildBuildingCard = (cardBuilding, author, index = null, length = null) => {
  const file = new AttachmentBuilder('card_bank/Buildings/' + cardBuilding.ID + '.jpg')
  file.name = cardBuilding.ID + '.jpg'
  const embed = new EmbedBuilder()
    .setColor(getColor(cardBuilding.Rarity))
    .setAuthor(author)
    .setTitle(cardBuilding.Name)
    .setThumbnail(`attachment://${file.name}`)
    .setDescription(cardBuilding.Family + '\nCoût de construction: ' + cardBuilding.Cost)

  const stat = getGivingStat(cardBuilding)
  if (stat !== '\u200b') {
    embed.addFields({
      name: 'Stats données',
      value: stat
    })
  }

  if (cardBuilding['Special Ability']) {
    let ability = cardBuilding['Special Ability']
    ability = ability.replace('damage', emojis.damage)
    ability = ability.replace('Damage', emojis.damage)
    ability = ability.replace('aim', emojis.aim)
    ability = ability.replace('Aim', emojis.aim)
    ability = ability.replace('speed', emojis.speed)
    ability = ability.replace('Speed', emojis.speed)
    ability = ability.replace('hp', emojis.hp)
    ability = ability.replace('health', emojis.hp)
    ability = ability.replace('Hp', emojis.hp)
    ability = ability.replace('Health', emojis.hp)
    ability = ability.replace('armor', emojis.armor)
    ability = ability.replace('Armor', emojis.armor)
    ability = ability.replace('resilience', emojis.resilience)
    ability = ability.replace('Resilience', emojis.resilience)
    ability = ability.replace('range', emojis.range)
    ability = ability.replace('Range', emojis.range)
    ability = ability.replace('move', emojis.move)
    ability = ability.replace('Move', emojis.move)
    ability = ability.replace('kits', 'kit')
    ability = ability.replace('Kits', 'Kit')
    ability = ability.replace('kit', emojis.kit)
    ability = ability.replace('Kit', emojis.kit)
    ability = ability.replace('energy', emojis.energy)
    ability = ability.replace('Energy', emojis.energy)
    embed.addFields({
      name: 'Effet unique:',
      value: `*${ability}*`
    })
  }

  if (cardBuilding.Targets !== 'None') {
    embed.addFields({
      name: getTarget(cardBuilding.Targets),
      value: '\u200b'
    })
  }


  if (index != null && length != null) {
    embed.setFooter({
      text: 'Carte ' + (index + 1) + ' / ' + length
    })
  } else if (cardBuilding.Target && cardBuilding.Target !== 'None') {
    embed.addFields({
      name: getTarget(cardBuilding.Target),
      value: '\u200b'
    })
  }

  return {
    embeds: [embed],
    files: [file]
  }
}

module.exports = { BuildRobotCard, BuildMasteryCard, BuildBuildingCard }
