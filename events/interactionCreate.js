const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
			return;
		}

		/*
		if (interaction?.message?.interaction?.commandName) {
			switch (interaction.message.interaction.commandName) {
				case 'help':
					if (interaction.values != null && interaction.values.length >= 1) {
						if (interaction.values.includes('server')) {
							await interaction.message.interaction.update("Test")
						}
						else {
							await interaction.reply("Test 2")
						}

					}
					return
				default:
					console.log(interaction.message.interaction.commandName)
					return;
			}
		}*/


	},
};
