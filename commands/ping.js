const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const time = Date.now()
		await interaction.reply('Pinging...');
		await interaction.editReply('Pong! ' + (Date.now() - time).toString() + 'ms.')
	},
};