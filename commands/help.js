const { SlashCommandBuilder, Colors, ActionRowBuilder, StringSelectMenuOptionBuilder, AttachmentBuilder, StringSelectMenuBuilder, EmbedBuilder} = require('discord.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Donne quelques informations a moitié utiles'),
	async execute(interaction) {

		const select = new StringSelectMenuBuilder()
			.setCustomId('help')
			.setPlaceholder('Choisissez votre sujet.')
			.addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel('Serveur')
                .setDescription('Obtenez toutes les informations nécéssaire sur le serveur.')
                .setValue('server'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Commandes')
					.setDescription('Présentation de la liste des commandes disponibles.')
					.setValue('command'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Système d\'xp')
					.setDescription('Comprennez le fonctionnement du système d\'experience du serveur.')
					.setValue('xp')
			);

        const row = new ActionRowBuilder()
			.addComponents(select);

        const embedHelp = new EmbedBuilder()
            .setColor(Colors.Orange)
            .setAuthor({ name: interaction.user.globalName })
            .setTitle(`Choisissez le sujet dont vous souhaitez avoir plus d'information`);


		const response = await interaction.reply({
            embeds: [embedHelp],
			components: [row],
		});

        try {
            const confirmation = await response.awaitMessageComponent({ time: 60_000 });

            if (confirmation.values.includes('server')) {

                const embedServer = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setAuthor({ name: interaction.user.globalName })
                    .setTitle(`Informations a propos de ${confirmation.values[0]} [NIY]`);

                await confirmation.update({ embeds: [embedServer], components: [] });
            } else if (confirmation.values.includes('command')) {
                
                const embedCommand = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setAuthor({ name: interaction.user.globalName })
                    .setTitle(`Informations a propos de ${confirmation.values[0]} [NIY]`);

                await confirmation.update({ embeds: [embedCommand], components: [] });
            } else if (confirmation.values.includes('xp')) {
                
                const embedXp = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setAuthor({ name: interaction.user.globalName })
                .setTitle(`Informations a propos de ${confirmation.values[0]} [NIY]`);

                await confirmation.update({ embeds: [embedXp], components: [] });
            }
        } catch(e) {
            interaction.deleteReply();
            return;
        }


        /*
        let filename = "Evoli.png";

        if ((getRandomInt(100) == 1))
            filename = "Evoli_shiny.png";

        let file = new AttachmentBuilder(filename)

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("Bonjour!")
            .setAuthor({ name: interaction.user.globalName })
            .setDescription(`Je suis un bot destiné a assister ce serveur en donnant accès a des informations du jeu comme une banque de donnée. 
            Mais pour le moment je suis en developpement alors n'en attendez pas trop!
            Cependant, Voici l'image d'un évoli pour illuminer votre journée!
            PS: il a 1% de chance d'être shiny ^^
            `)
            .setImage(`attachment://${filename}`);

            
        interaction.reply(
            { embeds: [embed], files: [file] }
        );*/
	},                
};