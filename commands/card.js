const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, DiscordAPIError, Colors } = require('discord.js');
const cards = require('../card_bank/data.json');

const getCards = () => {
    let list = [];

    cards.Robots.forEach(ele => {
        list.push({
            name: ele.Name,
            value: ele.Name
        })
    });

    cards.Buildings.forEach(ele => {
        list.push({
            name: ele.Name,
            value: ele.Name
        })
    });

    cards.Masteries.forEach(ele => {
        list.push({
            name: ele.Name,
            value: ele.Name
        })
    });

    return list
}

const getColor = (color) => {
    switch (color.toLowerCase()) {
        case "iron":
            return Colors.Orange;
        case "steel":
            return Colors.Grey;
        case "titanium":
            return Colors.Yellow;
        case "shadow":
            return Colors.Purple;
        default:
            return Colors.Orange
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
                /*.addChoices(
                        ...getCards()
				    )*/
                ),
	async execute(interaction) {

        const cardRobot = cards.Robots.find(e => e.Name.toLowerCase() == interaction.options.getString('nom').toLowerCase())

        if (cardRobot) {

            let file = new AttachmentBuilder("card_bank/Robots/" + cardRobot.ID + ".png")
            file.name = cardRobot.ID + '.png' 
            const embed = new EmbedBuilder()
                .setColor(getColor(cardRobot.Rarity))
                .setTitle(cardRobot.Name)
                .setDescription("Type: Robot" + "\n" + "Classe: " + cardRobot.Family + "\n" + "Coût en Kit: " + cardRobot.Cost)
                .setImage(`attachment://${file.name}`);


            await interaction.reply(
                {
                    embeds: [embed],
                    files: [file]
                });
            return
        }

        const cardBuilding = cards.Robots.find(e => e.Name.toLowerCase() == interaction.options.getString('nom').toLowerCase())

        if (cardBuilding) {
            await interaction.reply("Carte Building trouvé")
            return
        }

        const cardMasterie = cards.Robots.find(e => e.Name.toLowerCase() == interaction.options.getString('nom').toLowerCase())

        if (cardMasterie) {
            await interaction.reply("Carte Mastery trouvé")
            return
        }

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Erreur")
            .setAuthor({ name: interaction.user.username })
            .setDescription("La carte donnée n'a pas pus être trouvé!")

        await interaction.reply(
            { embeds: [embed] }
        );
        return


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
            });*/
	},
};