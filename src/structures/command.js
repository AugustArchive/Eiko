module.exports = class EikoCommand
{
    /**
     * Creates a new instance of the Command instance
     * @param {import('./client')} client The client instance
     * @param {CommandInfo} info The command info
     */
    constructor(client, info)
    {
        this.client      = client;
        this.command     = info.command;
        this.description = info.description;
        this.usage       = info.usage || '';
        this.category    = info.category || 'Generic';
        this.aliases     = info.aliases || [];
        this.cooldown    = info.cooldown || 3;
    }

    /**
     * Runs the command
     * @param {import('eris').Message} msg The message
     * @param {string[]} args The command arguments
     */
    async run(msg, args)
    {
        return msg.reply(`:x: **|** Unable to run the \`${this.command}\` command since it has no functionally.`);
    }
};

/**
 * @typedef {Object} CommandInfo
 * @prop {string} command The command name
 * @prop {string|((client: import('./client')) => string)} description Provides a description of the command
 * @prop {string} [usage] The command usage
 * @prop {string} [category] The command category
 * @prop {string[]} [aliases=[]] The command aliases
 * @prop {number} [cooldown=3] The command cooldown throttle
 */