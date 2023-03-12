const express = require("express");
const axios = require("axios");
const { createServer } = require("http");
const cors = require('cors')
const HTMLParser = require('node-html-parser');

const app = express();

app.use(express.json());
app.use(cors())
const httpServer = createServer(app);

const subdomain = "/rakko/api";
const port = 8080

app.options(subdomain + "/getLink", cors())
app.get(subdomain + "/getLink", async (req, res) => {
    let link = req.query.link //?link=...
    let url = new URL(link);
    if(url.hostname != "bayfiles.com"){
        res.status(403).send("Invalid url")
        return
    }

    axios.get(link).then((response)=>{
        let root = HTMLParser.parse(response.data)
        let link = root.querySelector("#download-url")._attrs.href
        res.status(200).send(link)
    })
    .catch(error=>{
        res.status(500).send("Failed to fetch url")
    })
});


httpServer.listen(port,()=>{console.log( `Server listening on port ${port} !`)})