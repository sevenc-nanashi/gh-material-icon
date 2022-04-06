const { get } = require('axios');
const { load } = require('js-yaml');
const fs = require('fs').promises;

(async()=>{
  const rawYaml = await get("https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml")
  const yaml = load(rawYaml.data);
  await fs.writeFile("languages.json", JSON.stringify(yaml, null, 2));
})()