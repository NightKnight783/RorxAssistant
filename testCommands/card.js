const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, DiscordAPIError } = require('discord.js');
const cards = require('../card_bank/data.json');

const getCards = () => {
    let list = [];

    cards
        .forEach(ele => {
            list.push({
                name: ele.name,
                value: ele.name
            })
        });

    return list
}

const getColor = (color) => {
    switch (color) {
        case "iron":
            return 0x101010;
        case "steel":
            return 0x00FFFF;
        case "titanium":
            return 0xFFFF00;
        case "shadow":
            return 0xFFFF00;
        default:
            return 0x00FF00
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
                .addChoices(
                        ...getCards()
				    )
                ),
	async execute(interaction) {
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
            });
	},
};