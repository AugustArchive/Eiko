const Command = require('../structures/command');

module.exports = class AddAdminCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'add-admin',
            description: 'Adds an administrator to restart/start/stop projects',
            usage: '<userID>'
        });
    }

    /**
     * Runs the `add-admin` command
     * @param {import('eris').Message} msg The message
     * @param {string[]} args The command arguments
     */
    async run(msg, args)
    {
        if (!args[0]) return msg.channel.createMessage(':x: **|** No admin ID, mention, or name was provided');
        const user = await this.getUser(args[0]);
        this.client.admins.push(user.id);
        return msg.channel.createMessage(`:ok_hand: **|** Added ${user.username}#${user.discriminator} to the admins list! They will be an admin until bot restart.`);
    }

    /**
     * Resolves a Discord user
     * @param {string} query The query
     * @returns {Promise<import('eris').User>} The user that was found
     */
    getUser(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const user = this.client.users.get(query);
                if (user) return resolve(user);
            } else if (/^<@!?(\d+)>$/.test(query)) {
                const match = query.match(/^<@!?(\d+)>$/);
                const user = this.client.users.get(match[1]);
                if (user) return resolve(user);
            } else if (/^(.+)#(\d{4})$/.test(query)) {
                const match = query.match(/^(.+)#(\d{4})$/);
                const users = this.client.users.filter((user) => user.username === match[1] && Number(user.discriminator) === Number(match[2]));
                if (users.length > 0) return resolve(users[0]);
            } else {
                const users = this.client.users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
                if (users.length > 0) return resolve(users[0]);
            }
            reject();
        });
    }
};