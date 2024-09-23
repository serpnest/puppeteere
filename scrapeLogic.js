const puppeteer = require("puppeteer");
const axios = require('axios')
require("dotenv").config();

const scrapeLogic = async (postData, res) => {
  try {
    const request = await axios.post(postData.url, {
      projectId: postData.projectId,
      period: postData.period,
    })
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
          process.env.NODE_ENV === "production"
              ? process.env.PUPPETEER_EXECUTABLE_PATH
              : puppeteer.executablePath(),
    });
    try {
      const page = await browser.newPage();

      await page.setContent(request.data)

      return await page.pdf();
    } catch (e) {
      console.error(e);
      res.send(`Something went wrong while running Puppeteer: ${e}`);
    } finally {
      await browser.close();
    }
  } catch (e) {
    console.log('!!!!!', e, postData.url, postData.projectId, postData.period, process.env.NODE_ENV);
  }
};

module.exports = { scrapeLogic };
