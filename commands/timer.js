const { SlashCommandBuilder, SharedSlashCommandOptions, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
	    .setName('timer')
	    .setDescription('Countdown timer for anything you want')
	    .addStringOption(option =>
		    option.setName('name')
			    .setDescription('Give your countdown timer a name')
			    .setRequired(true))
	    .addIntegerOption(option =>
		    option.setName('days')
			    .setDescription('Number of days')
                .setMinValue(0))
	    .addIntegerOption(option =>
		    option.setName('hours')
			    .setDescription('Number of hours')
                .setMinValue(0))
	    .addIntegerOption(option =>
		    option.setName('minutes')
			    .setDescription('Number of minutes')
                .setMinValue(0))
	    .addIntegerOption(option =>
		    option.setName('seconds')
			    .setDescription('Number of seconds')
                .setMinValue(0)),

	async execute(interaction) {
        const name = (interaction.options.getString('name'))[0].toUpperCase() + (interaction.options.getString('name')).substring(1);
        const days = interaction.options.getInteger('days') ?? 0;
        const hours = interaction.options.getInteger('hours') ?? 0;
        const minutes = interaction.options.getInteger('minutes') ?? 0;
        const seconds = interaction.options.getInteger('seconds') ?? 0;
        const total = days * 86400 + hours * 3600 + minutes * 60 + seconds;
        
        function formatTime(seconds) {
            return [
                parseInt(seconds / 60 / 60),
                parseInt(seconds / 60 % 60),
                parseInt(seconds % 60)
            ]
                .join(":")
                .replace(/\b(\d)\b/g, "0$1")
        }

        const formatted = formatTime(seconds);
        const FormattedEmbed = new EmbedBuilder()
	    .setColor('#2f3136')
	    .setDescription(`<:clock:1037318080684113932> **|** __Countdown Timer__\n\`${name}\` **»** ${formatted}`)
    
		await interaction.reply({ embeds: [FormattedEmbed] });

        // Set I as seconds and minus it by 1 after updating it and waiting 1 second  
        for (i = total-1; i >= 0; i--) {
            let time = formatTime(i);
            await wait(1000)

            const CountdownEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<:clock:1037318080684113932> **|** __Countdown Timer__\n\`${name}\` **»** ${time}`)

            await interaction.editReply({ embeds: [CountdownEmbed] })
        }

        // Once the countdown has reached 1 second, edit to countdown complete and follow up with a mention.
        const Finished = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`<:check:1037315609089822751> **|** __Countdown Timer__\n\`${name}\`'s countdown timer has finished.`)
        await interaction.editReply({ embeds: [Finished] })
        await interaction.followUp(`<@${interaction.user.id}>`);
	},
};