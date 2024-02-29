const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Colors } = require('discord.js')
const cards = require('../card_bank/data.json')
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

  const line1 = `${hp}   ${speed}`
  const line2 = `${damage}   ${resilience}`

  const line3 = `${aim}   ${armor}`
  const line4 = `${move}   ${range}`

  return {
    name: `${line1}\n${line2}\n${line3}\n${line4}`,
    value: '\u200B'
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('card')
    .setDescription('Donne les informations a propos d\'une carte')
    .addStringOption(option =>
      option
        .setName('nom')
        .setRequired(true)
        .setDescription('Nom de la carte a rechercher')
    ),
  async execute (interaction) {
    const author = {
      name: interaction.user.globalName,
      iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar
    }

    const cardRobot = cards.Robots.find(e => e.Name.toLowerCase() === interaction.options.getString('nom').toLowerCase())

    if (cardRobot) {
      const file = new AttachmentBuilder('card_bank/Robots/' + cardRobot.ID + '.png')
      file.name = cardRobot.ID + '.png'
      const embed = new EmbedBuilder()
        .setColor(getColor(cardRobot.Rarity))
        .setAuthor(author)
        .setTitle(cardRobot.Name)
        .setDescription('**Statistiques:**')
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

      await interaction.reply(
        {
          embeds: [embed],
          files: [file]
        })
      return
    }

    const cardBuilding = cards.Robots.find(e => e.Name.toLowerCase() === interaction.options.getString('nom').toLowerCase())

    if (cardBuilding) {
      await interaction.reply("Carte Building trouvé, mais cette commande n'est pas encore disponible pour les batiments")
    }

    const cardMasterie = cards.Robots.find(e => e.Name.toLowerCase() === interaction.options.getString('nom').toLowerCase())

    if (cardMasterie) {
      await interaction.reply("Carte Mastery trouvé, mais cette commande n'est pas encore disponible pour les maitrise")
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('Erreur')
      .setAuthor(author)
      .setDescription("La carte donnée n'a pas pus être trouvé!")

    await interaction.reply(
      { embeds: [embed] }
    )

    /*
        const cardList = cards.filter(e => e.name === interaction.options.getString('nom'));

        if (!cardList.length) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle("Erreur")
                .setAuthor({ name: interaction.user.username })
                .setDescription("La carte donnée n'a pas pus être trouvé!")

            interaction.reply(
                { embeds: [embed] }
            );
            return
        }

        const card = cardList[0];

        let file = new AttachmentBuilder("card_bank/" + card.type.toLowerCase() + "/" + card.class.toLowerCase() + "/" + card.cardSpriteName)
        file.name = card.cardSpriteName + '.jpg'
        const embed = new EmbedBuilder()
            .setColor(getColor(card.rarity))
            .setTitle(card.name)
            .setDescription("Type: " + card.type + "\n" + "Classe: " + card.class + "\n" + "Coût de création: " + card.pieceCost + "\n\n" +card.description)
            .setImage(`attachment://${file.name}`);

        await interaction.reply(
            {
                embeds: [embed],
                files: [file]
            }); */
  }
}
