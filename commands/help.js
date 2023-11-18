const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Donne quelques informations a moitié utiles'),
	async execute(interaction) {

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
        );
	},                
};