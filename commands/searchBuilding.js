const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js')
const cards = require('../card_bank/data.json')
const { BuildBuildingCard } = require('../utils/CardBuild')

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

    const cardResponse = BuildBuildingCard(cardList[index], author, index, cardList.length)

    const responseLoop = await confirmation.update({ ...cardResponse, components: [components] })

    return await showCard(responseLoop, interaction, components, cardList, index)
  } catch (e) {
    response.edit({ components: [] })
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search_building')
    .setDescription('Permet de rechercher un bâtiment')
    .addStringOption(option =>
      option
        .setName('rarity')
        .setRequired(false)
        .setDescription('Raretée du bâtiment')
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
        .setDescription('Famille du bâtiment')
        .addChoices({
          name: 'Armurie',
          value: 'armory'
        }, {
          name: 'Usine',
          value: 'factory'
        }, {
          name: 'Laboratoire',
          value: 'lab'
        }, {
          name: 'Démolisseur',
          value: 'wrecker'
        })
    )
    .addIntegerOption(option =>
      option
        .setName('min_cost')
        .setRequired(false)
        .setDescription('Coût minimal de construction du bâtiment')
    )
    .addIntegerOption(option =>
      option
        .setName('max_cost')
        .setRequired(false)
        .setDescription('Coût maximal de construction du bâtiment')
    ),
  async execute (interaction) {
    const author = {
      name: interaction.user.globalName,
      iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar
    }

    const allBuildings = cards.Buildings

    let searchedBuildings = allBuildings.filter((building) => {
      let fillRequire = true

      if (interaction.options.getString('rarity')) {
        fillRequire = fillRequire & building.Rarity.toLowerCase().startsWith(interaction.options.getString('rarity'))
      }
      if (interaction.options.getString('family')) {
        fillRequire = fillRequire & building.Family.toLowerCase().startsWith(interaction.options.getString('family'))
      }
      if (interaction.options.getInteger('min_cost')) {
        fillRequire = fillRequire & building.Cost >= interaction.options.getInteger('min_cost')
      }
      if (interaction.options.getInteger('max_cost')) {
        fillRequire = fillRequire & building.Cost <= interaction.options.getInteger('max_cost')
      }

      return fillRequire
    })

    if (!searchedBuildings.length) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Erreur')
        .setAuthor(author)
        .setDescription("Aucun bâtiment correspondant à ces informations n'a pût être trouvé!")

      return await interaction.reply({ embeds: [embed] })
    }

    searchedBuildings = searchedBuildings.sort((a, b) => {
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

    const responseCard = BuildBuildingCard(searchedBuildings[0], author, 0, searchedBuildings.length)

    const response = await interaction.reply({
      ...responseCard,
      components: [row]
    })

    return await showCard(response, interaction, row, searchedBuildings)
  }
}
