const child = require('child_process');

module.exports = class Project
{
    /**
     * Creates a new instance of the project interface
     * @param {ProjectInfo} info The project info
     */
    constructor(info)
    {
        this.name        = info.name;
        this.status      = info.status;
        this.pm2         = info.pm2;
        this.description = info.description;
    }

    /**
     * Sets the status
     * @param {'online' | 'dnd' | 'offline'} status The status
     */
    setStatus(status)
    {
        this.status = status;
        return this;
    }

    /**
     * Determines the status bubble
     */
    getStatusBubble()
    {
        return {
            offline: '<:offline:457289010084184066>',
            dnd: '<:dnd:457289032330772502>',
            online: '<:online:457289010037915660>'
        }[this.status];
    }

    /**
     * Restarts the process
     * @returns {ExecutionProcess}
     */
    restart()
    {
        const result = {};
        child.exec(`pm2 restart ${this.pm2}`, (error, stdout, stderr) => {
            result.error  = error;
            result.stdout = stdout;
            result.stderr = stderr;
        });

        return result;
    }

    /**
     * Stops the process
     * @returns {ExecutionProcess}
     */
    stop()
    {
        const result = {};
        child.exec(`pm2 stop ${this.pm2}`, (error, stdout, stderr) => {
            result.error  = error;
            result.stdout = stdout;
            result.stderr = stderr;
        });
        return result;
    }

    /**
     * Starts the process
     * @returns {ExecutionProcess}
     */
    start()
    {
        const result = {};
        child.exec(`pm2 start ${this.pm2}`, (error, stdout, stderr) => {
            result.error  = error;
            result.stdout = stdout;
            result.stderr = stderr;
        });
        return result;
    }
};

/**
 * @typedef {Object} ProjectInfo
 * @prop {string} name The project name
 * @prop {"online" | "dnd" | "offline"} status The status
 * @prop {string} pm2 The pm2 project name
 * @prop {string} description The description of the project
 * 
 * @typedef {Object} ExecutionProcess
 * @prop {import('child_process').ExecException} error The error
 * @prop {string} stdout The result
 * @prop {string} stderr The error result
 */