console.info("%cMaterial Icon for GitHub\n%cCreated by sevenc-nanashi", "font-size: 1.5em; text-decoration: underline;", "font-size: 1em");
let baseIconData = {};
let languageData = {};

async function fetchData() {
  Object.assign(
    baseIconData,
    await (await fetch(browser.runtime.getURL("material-icons.json"))).json()
  );
  Object.assign(
    languageData,
    await (await fetch(browser.runtime.getURL("languages.json"))).json()
  );
}
async function main() {
  if(!baseIconData.iconDefinitions) { await fetchData(); }
  let colorMode = document.documentElement.getAttribute("data-color-mode");
  let extraIconData = {};

  if (colorMode == "auto") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) {
      colorMode = document.documentElement.getAttribute("data-dark-theme");
    } else {
      colorMode = document.documentElement.getAttribute("data-light-theme");
    }
  }
  if (colorMode.includes("light")) {
    extraIconData = baseIconData.light;
  }
  const iconData = {
    ...baseIconData,
    fileExtensions: {
      ...baseIconData.fileExtensions,
      ...extraIconData.fileExtensions,
    },
    fileNames: {
      ...baseIconData.fileNames,
      ...extraIconData.fileNames,
    },
    folderNames: {
      ...baseIconData.folderNames,
      ...extraIconData.folderNames,
    },
  };
  const files = document.querySelectorAll(
    '[aria-labelledby="files"] > .Box-row.Box-row--focus-gray.py-2.d-flex.position-relative.js-navigation-item'
  );
  for (const file of files) {
    const name = file
      .querySelector('[role="rowheader"] > span > a')
      ?.innerText?.toLowerCase();
    const iconNode = file.querySelector("svg.octicon");
    iconNode.parentElement.style.transform = `scale(1.25) translateY(-1px)`;

    if (!name) {
      // Submodule
      const iconUrl = browser.runtime.getURL(`./icons/folder-git.svg`);
      iconNode.innerHTML = ``;
      iconNode.style.backgroundImage = `url(${iconUrl})`;
      continue;
    }
    if (file.querySelector(".hx_color-icon-directory")) {
      // If folder
      const folderIcon = iconData.folderNames[name] || "folder";

      const iconUrl = browser.runtime.getURL(`./icons/${folderIcon}.svg`);
      iconNode.innerHTML = ``;
      iconNode.style.backgroundImage = `url(${iconUrl})`;
    } else {
      // File
      const langaugeName = Object.values(languageData).find(
        (lang) =>
          lang.filenames?.map((fileName) => fileName.toLowerCase()).includes(name) ||
          lang.extensions?.find((ext) =>
            name.match(new RegExp(`${escapeRegex(ext)}$`, "gi"))
          )
      )?.ace_mode;
      const fileIcon =
        iconData.fileNames[name] ||
        Object.entries(iconData.fileExtensions).find(([ext, _val]) =>
          name.match(new RegExp(`\\.${escapeRegex(ext)}$`))
        )?.[1] ||
        iconData.fileExtensions[langaugeName] ||
        (iconData.iconDefinitions[langaugeName] && langaugeName) ||
        "file";

      const iconUrl = browser.runtime.getURL(
        iconData.iconDefinitions[fileIcon].iconPath.replace("../", "")
      );
      iconNode.innerHTML = ``;
      iconNode.style.backgroundImage = `url(${iconUrl})`;
    }
  }
}

const observer = new MutationObserver(main);
observer.observe(document.querySelector("#js-repo-pjax-container"), {
  childList: true,
  subtree: true,
});

fetchData();
main();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
