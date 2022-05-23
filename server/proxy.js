const axios = require("axios");

const xml2js = require("xml2js");
const parser = new xml2js.Parser();

const server = require('./server');
const baseurl = process.env.BASE_URL

server.get("/proxy", async (req, res) => {
  // proxy only requests to nyaa anime to prevent attacks
  if (!req?.query?.url?.startsWith(`${baseurl}`)) {
    res.status(403).send("Forbidden");
    return;
  }
  try {
    const { data: xmlStr } = await axios.get(req.query.url);
    const result = await parser.parseStringPromise(xmlStr);
    const titles = result.rss.channel[0].item.map(
      ({ title: [title] }) => title
    );
    res.send(titles);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});
