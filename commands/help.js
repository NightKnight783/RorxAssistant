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
                    .setColor(Colors.Purple)
                    .setAuthor({ name: interaction.user.globalName })
                    .setTitle(`Informations a propos de ${confirmation.values[0]} [NIY]`);

                await confirmation.update({ embeds: [embedServer], components: [] });
            } else if (confirmation.values.includes('command')) {
                
                const embedCommand = new EmbedBuilder()
                .setColor(Colors.Green)
                .setAuthor({ name: interaction.user.globalName })
                .setTitle(`Liste des commandes disponibles`)
                .setDescription(`Les paramètres indiqués sont soit [obligatoires] ou (optionnels)`)
                .addFields({
                    name: "\`/help\`",
                    value: "Permet d'afficher la page d'aide (que vous avez utilisé pour voir cet embed ^^)."
                })
                .addFields({
                    name: "\`/card [nom]\`",
                    value: "Permet d'afficher la carte RoRx correspondant au nom donné."
                })
                .addFields({
                    name: "\`/search\` [NIY]",
                    value: "Permet de retrouver une carte dont on ne connais pas le nom en donnant un maximum de détail a son propos dans un formulaire."
                })
                .addFields({
                    name: "\`/ping\`",
                    value: "Simple test de délai du bot."
                })
                .addFields({
                    name: "\`/leaderboard\`",
                    value: "Affiche les 10 membres les plus actifs du serveur avec leurs niveaux et points d'éxperience."
                })
                .addFields({
                    name: "\`/level (membre)\`",
                    value: "Permet d'afficher les informations relatives a l'xp de soit-même, ou du membre indiqué."
                })

                await confirmation.update({ embeds: [embedCommand], components: [] });
            } else if (confirmation.values.includes('xp')) {
                
                const embedXp = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setAuthor({ name: interaction.user.globalName })
                    .setTitle(`Le système d'xp permet d'attribuer au membres du serveur des points en focntion de leur activité sur ce dernier.`)
                    .setDescription(`Chaque message octroie entre 20 et 30 points d'experience (aléatoirement) avec un délai minimum de 10s entre chaque message.\n\nPour monter de niveau, le coût en éxperience est de 500 multiplié par le niveau actuel du membre.\n(Niveau 5 => 2500 points d'éxperience nécéssaires).\n\nVoici également des commandes pouvant vous êtres utiles:`)
                    .addFields({
                        name: "\`/level (membre)\`",
                        value: "Cette commande permet d'afficher votre niveau et nombre de point d'éxperience actuel/requis pour monter de niveau.\nSi l'option (membre) est précisié, les informations affichés seront celles de ce membre."
                    })
                    .addFields({
                        name: "\`/leaderboard\`",
                        value: "Affiche les 10 membres les plus actifs du serveur avec leurs niveaux et points d'éxperience."
                    })

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