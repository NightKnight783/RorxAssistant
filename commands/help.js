const { SlashCommandBuilder, ButtonStyle, Colors, ActionRowBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, StringSelectMenuBuilder, EmbedBuilder} = require('discord.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

loopButton = async (response, interaction, components) => {
    try {
        if (!response)
            return;

        const confirmation = await response.awaitMessageComponent({ time: 300_000 });

        let responseLoop = null;

        switch(confirmation.customId) {
            case 'server':  
                const embedServer = new EmbedBuilder()
                    .setColor(Colors.Purple)
                    .setAuthor({ name: interaction.user.globalName })
                    .setTitle(`Informations a propos du serveur [NIY]`);

                responseLoop = await confirmation.update({ embeds: [embedServer], components: [components] });
                break;

            case 'command': 
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

                responseLoop = await confirmation.update({ embeds: [embedCommand], components: [components] });
                break;

            case 'xp':
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

                responseLoop = await confirmation.update({ embeds: [embedXp], components: [components] });
                break;
        }

        return await loopButton(responseLoop, interaction, components)
    } catch(e) {
        console.log(e)
        interaction.deleteReply();
        return;
    }
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Donne quelques informations a moitié utiles'),
	async execute(interaction) {

        const server = new ButtonBuilder()
            .setCustomId('server')
            .setLabel('Serveur')
            .setStyle(ButtonStyle.Primary);

        const command = new ButtonBuilder()
            .setCustomId('command')
            .setLabel('Commandes')
            .setStyle(ButtonStyle.Primary);

        const xp = new ButtonBuilder()
            .setCustomId('xp')
            .setLabel('Experience')
            .setStyle(ButtonStyle.Primary);

            /*
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
*/
        const row = new ActionRowBuilder()
            .addComponents(server, command, xp);

        const embedHelp = new EmbedBuilder()
            .setColor(Colors.Orange)
            .setAuthor({ name: interaction.user.globalName })
            .setTitle(`Choisissez le sujet dont vous souhaitez avoir plus d'information (Ce message est supprimé 5 minutes après inactivité)`);


		const response = await interaction.reply({
            embeds: [embedHelp],
			components: [row],
		});

        return await loopButton(response, interaction, row)
	},                
};