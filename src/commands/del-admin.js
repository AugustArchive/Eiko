const Command = require('../structures/command');

module.exports = class DeleteAdminCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'del-admin',
            description: 'Deletes an admin from the admins array',
            usage: '<user>'
        });
    }

    /**
     * Runs the `del-admin` command
     * @param {import('eris').Message} msg The message
     * @param {string[]} args The command arguments
     */
    async run(msg, args) 
    {
        if (!args[0]) return msg.channel.createMessage(':x: **|** Unable to remove an admin without specifying a user ID, mention or name');
        if (!this.client.admins.includes(args[0])) return msg.channel.createMessage(`:x: **|** Unable to remove \`${args[0]}\` because they're not an admin!`);
        const i = this.client.admins.indexOf(args[0]);
        this.client.admins.splice(i, 0);
        return msg.channel.createMessage(`:ok_hand: **|** Removed \`${args[0]}\` from the admins list!`);
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