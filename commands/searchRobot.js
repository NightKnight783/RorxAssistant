const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js')
const cards = require('../card_bank/data.json')
const { BuildRobotCard } = require('../utils/CardBuild')

const costList = [
  {
    name: '1',
    value: 1
  }, {
    name: '2',
    value: 2
  }, {
    name: '3',
    value: 3
  }, {
    name: '4',
    value: 4
  }, {
    name: '5',
    value: 5
  }, {
    name: '6',
    value: 6
  }, {
    name: '7',
    value: 7
  }, {
    name: '8',
    value: 8
  }, {
    name: '9',
    value: 9
  }, {
    name: '10',
    value: 10
  }, {
    name: '11',
    value: 11
  }, {
    name: '12',
    value: 12
  }
]

const showCard = async (response, interaction, components, cardList, index = 0) => {
  try {
    if (!response) { return }

    const author = {
      name: interaction.user.globalName,
      iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar
    }

    const confirmation = await response.awaitMessageComponent({ time: 300_000 }).catch()

    switch (confirmation.customId) {
      case 'previous': {
        index--
        if (index < 0) { index = cardList.length - 1 }
        break
      }
      case 'next': {
        index++
        if (index >= cardList.length) { index = 0 }
        break
      }
    }

    const cardResponse = BuildRobotCard(cardList[index], author, index, cardList.length)

    const responseLoop = await confirmation.update({ ...cardResponse, components: [components] })

    return await showCard(responseLoop, interaction, components, cardList, index)
  } catch (e) {
    response.edit({ components: [] })
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search_robot')
    .setDescription('Permet de rechercher un robot')
    .addStringOption(option =>
      option
        .setName('rarity')
        .setRequired(false)
        .setDescription('Raretée du robot')
        .addChoices({
          name: 'Fer',
          value: 'iron'
        }, {
          name: 'Acier',
          value: 'steel'
        }, {
          name: 'Titane',
          value: 'titanium'
        }, {
          name: 'Ombre',
          value: 'shadow'
        })
    )
    .addStringOption(option =>
      option
        .setName('family')
        .setRequired(false)
        .setDescription('Famille du robot')
        .addChoices({
          name: 'Infantrie',
          value: 'infantry'
        }, {
          name: 'Artillerie',
          value: 'artillery'
        }, {
          name: 'Défenseur',
          value: 'defender'
        }, {
          name: 'Elémentaire',
          value: 'elemental'
        }, {
          name: 'Chasseur',
          value: 'hunter'
        }, {
          name: 'Resourceur',
          value: 'resourcer'
        }, {
          name: 'Guerrier',
          value: 'warrior'
        })
    )
    .addIntegerOption(option =>
      option
        .setName('min_cost')
        .setRequired(false)
        .setDescription('Coût minimal du robot')
        .addChoices(...costList)
    )
    .addIntegerOption(option =>
      option
        .setName('max_cost')
        .setRequired(false)
        .setDescription('Coût maximal du robot')
        .addChoices(...costList)
    ),
  async execute (interaction) {
    const author = {
      name: interaction.user.globalName,
      iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar
    }

    const allRobots = cards.Robots

    let searchedRobots = allRobots.filter((robot) => {
      let fillRequire = robot.Released !== undefined

      if (interaction.options.getString('rarity')) {
        fillRequire = fillRequire & robot.Rarity.toLowerCase().startsWith(interaction.options.getString('rarity'))
      }
      if (interaction.options.getString('family')) {
        fillRequire = fillRequire & robot.Family.toLowerCase().startsWith(interaction.options.getString('family'))
      }
      if (interaction.options.getInteger('min_cost')) {
        fillRequire = fillRequire & robot.Cost >= interaction.options.getInteger('min_cost')
      }
      if (interaction.options.getInteger('max_cost')) {
        fillRequire = fillRequire & robot.Cost <= interaction.options.getInteger('max_cost')
      }

      return fillRequire
    })

    if (!searchedRobots.length) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Erreur')
        .setAuthor(author)
        .setDescription("Aucun robot correspondant à ces informations n'a pût être trouvé!")

      return await interaction.reply({ embeds: [embed] })
    }

    searchedRobots = searchedRobots.sort((a, b) => {
      if (a.Cost !== b.Cost) { return a.Cost - b.Cost }
      return a.Name.localeCompare(b.Name)
    })

    const previous = new ButtonBuilder()
      .setCustomId('previous')
      .setLabel('Précédent')
      .setStyle(ButtonStyle.Primary)

    const next = new ButtonBuilder()
      .setCustomId('next')
      .setLabel('Suivant')
      .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder()
      .addComponents(previous, next)

    const responseCard = BuildRobotCard(searchedRobots[0], author, 0, searchedRobots.length)

    const response = await interaction.reply({
      ...responseCard,
      components: [row]
    })

    return await showCard(response, interaction, row, searchedRobots)
  }
}
