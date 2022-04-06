require "http"
require "yaml"
require "json"

resp = HTTP.get("https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml")
File.write("languages.json", JSON.pretty_generate(YAML.load(resp.body)))
