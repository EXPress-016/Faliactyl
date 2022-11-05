const settings = require('../../handlers/readSettings').settings();
const getAllServers = require('../../handlers/getAllServers');
const fetch = require("node-fetch")
const db = require("../../handlers/database")

if (settings.renewal.enabled == true) {
setInterval(async function() {
    getAllServers().then(async servers => {
        for (const server of servers) {
            const renewal = await db.get(`renewal-${server.attributes.id}`)
            if (!renewal) continue
            if (renewal > Date.now()) continue
            if ((Date.now() - renewal) > (settings.renewal.delay * 86400000)) {
                const deleteserver = await fetch(
                    `${settings.pterodactyl.domain}/api/application/servers/${server.attributes.id}`, {
                        method: "delete",
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${settings.pterodactyl.key}`
                        }
                    }
                );
                if (await deleteserver.ok !== true) continue;
                await db.delete(`renewal-${server.attributes.id}`)
            }
        }
    })
}, 5000)}