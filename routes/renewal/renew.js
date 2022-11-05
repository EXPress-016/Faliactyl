const settings = require('../../handlers/readSettings').settings();
const db = require("../../handlers/database")

if (settings.renewal.enabled == true) {
module.exports.load = async function(app, ejs, olddb) {
app.get(`/renew`, async (req, res) => {
    if (!req.query.id) return res.send("Missing id.")
    if (!req.session.pterodactyl) return res.redirect("/")
    if (req.session.pterodactyl.relationships.servers.data.filter(server => server.attributes.id == req.query.id).length == 0) return res.send(`No server with the id ${req.query.id} was found.`);
    const renewal = await db.get(`renewal-${req.query.id}`)    
    if (renewal > Date.now()) return res.redirect("/dashboard")
    const coins = await db.get(`coins-${req.session.userinfo.id}`) ? await db.get(`coins-${req.session.userinfo.id}`) : 0;
    if (settings.renewal.cost > coins) return res.redirect("/dashboard?err=CANNOTAFFORDRENEWAL")
    await db.set(`coins-${req.session.userinfo.id}`, (coins - settings.renewal.cost))
    await db.set(`renewal-${req.query.id}`, (renewal + (settings.renewal.delay * 86400000)))
    return res.redirect("/dashboard?renewed=true")
})}}