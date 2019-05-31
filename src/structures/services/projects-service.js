const { Collection } = require('eris');
const Project        = require('../project');

module.exports = class ProjectService
{
    /**
     * Create a new instance of the project service
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        /**
         * The project array
         * @type {Collection<Project>}
         */
        this.projects = new Collection();

        this.addProjects();
    }

    addProjects()
    {
        this.projects.set('yamashiro', new Project({
            name: 'Yamashiro',
            status: 'online',
            pm2: 'yamashiro',
            description: ':robot: **Robust Discord multipurpose bot made in the Eris library**'
        }));

        this.projects.set('augu.dev', new Project({
            name: 'augu.dev',
            status: 'online',
            pm2: 'augu.me',
            description: ':wrench: **Official website of August (Chris)**'
        }));

        this.projects.set('kashima.space', new Project({
            name: 'kashima.space',
            status: 'offline',
            pm2: 'kashima-website',
            description: ':computer: **Official website of Kashima, a music player**'
        }));

        this.projects.set('api.kashima.space', new Project({
            name: 'Kashima API',
            status: 'online',
            pm2: 'kashima-api',
            description: ':zap: **API service to fetch plugins and skins.**'
        }));

        return this;
    }
};

/**
 * @typedef {Object} Project
 * @prop {string} name The project name
 * @prop {"online" |  "dnd" | "offline"} status The status
 * @prop {string} pm2 The pm2 project name
 */