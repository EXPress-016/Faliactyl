const settings = require("./readSettings").settings();
const fetch = require('node-fetch');

module.exports = async () => {
    const rawData = await fetch(
        `${settings.pterodactyl.domain}/api/application/servers?per_page=99999999`, {
            headers: {
                "Authorization": `Bearer ${settings.pterodactyl.key}`
            }
        }
    )
    return rawData.json()
}

