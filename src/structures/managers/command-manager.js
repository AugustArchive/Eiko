const { readdir }    = require('fs');
const CommandService = require('../services/command-service');
const { Collection } = require('eris');

module.exports = class CommandManager
{
    /**
     * Creates a new instance of the command manager
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client   = client;
        /** @type {Collection<import('../command')>} */
        this.commands = new Collection();
        this.service  = new CommandService(client);
    }

    async start()
    {
        readdir('./commands', (error, files) => {
            if (error) this.client.logger.error(error.stack);
            this.client.logger.info(`Building ${files.length} commands...`);
            for (let i = 0; i < files.length; i++)
            {
                try {
                    const file    = files[i];
                    const Command = require(`../../commands/${file}`);
                    const command = new Command(this.client);
    
                    this.commands.set(command.command, command);
                    this.client.logger.info(`Successfully initialized the ${command.command} command!`);
                } catch(ex) {
                    this.client.logger.error(ex.stack);
                }
            }
        });
    }
};