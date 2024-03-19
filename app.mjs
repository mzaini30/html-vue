#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import BuatIndex from "./app/buat-index.mjs";
import BuatDatabase from "./app/buat-database.mjs";
import fg from "fast-glob";
import watch from "node-watch";
import crypto from "crypto";
import { mdjsProcess } from "@mdjs/core";
import BuatRouter from "./app/buat-router.mjs";
import BuatIndexPagesPhp from "./app/buat-index-pages-php.mjs";
import BuatIndexPhp from "./app/buat-index-php.mjs";

if (!existsSync(".gitignore")) {
  writeFileSync(".gitignore", "database.sqlite");
}

if (!existsSync("api/")) {
  mkdirSync("api");
  mkdirSync("api/lib");
  mkdirSync("api/pages");
  if (!existsSync("api/lib/rb.php")) {
    fetch(
      "https://raw.githubusercontent.com/mzaini30/redbean-sqlite/master/rb-sqlite.php"
    )
      .then((x) => x.text())
      .then((x) => writeFileSync("api/lib/rb.php", x));
  }
  if (!existsSync("api/lib/router.php")) {
    writeFileSync("api/lib/router.php", BuatRouter());
  }
  if (!existsSync("api/pages/index.php")) {
    writeFileSync("api/pages/index.php", BuatIndexPagesPhp());
  }
  if (!existsSync("api/database.sqlite")) {
    writeFileSync("api/database.sqlite", "");
  }
  if (!existsSync("api/.htaccess")) {
    writeFileSync(
      "api/.htaccess",
      `<FilesMatch "database.sqlite">
    Order Allow,Deny
    Deny from all
</FilesMatch>`
    );
  }
  if (!existsSync("api/index.php")) {
    writeFileSync("api/index.php", BuatIndexPhp());
  }
}

if (!existsSync("lib/")) {
  mkdirSync("lib");
  let library = [
    {
      name: "vue",
      link: "https://unpkg.com/vue@3.4.21/dist/vue.global.prod.js",
    },
    {
      name: "vue-router",
      link: "https://unpkg.com/vue-router@4.3.0/dist/vue-router.global.prod.js",
    },
    {
      name: "alasql",
      link: "https://cdn.jsdelivr.net/npm/alasql@4",
    },
    {
      name: "swal",
      link: "https://cdn.jsdelivr.net/npm/sweetalert2@11",
    },
    {
      name: "db",
      link: "https://gist.githubusercontent.com/mzaini30/4cc377c8ba47b7452c1de0d9d4ce8476/raw/42fb6c2d46bf9d4f75a4855d59aa430725ea8df5/initDatabase.js",
    },
  ];
  for (let lib of library) {
    if (!existsSync(`lib/${lib.name}.js`)) {
      fetch(lib.link)
        .then((x) => x.text())
        .then((x) => writeFileSync(`lib/${lib.name}.js`, x));
    }
  }
  let libraryCss = [
    {
      name: "pico",
      link: "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css",
    },
  ];
  for (let lib of libraryCss) {
    if (!existsSync(`lib/${lib.name}.css`)) {
      fetch(lib.link)
        .then((x) => x.text())
        .then((x) => writeFileSync(`lib/${lib.name}.css`, x));
    }
  }
}
if (!existsSync("index.html")) {
  writeFileSync("index.html", BuatIndex());
}
if (!existsSync("pages/")) {
  mkdirSync("pages");
  if (!existsSync("pages/index.html")) {
    writeFileSync("pages/index.html", /*html*/ `<h1>Hello World</h1>`);
  }
  if (!existsSync("pages/database.html")) {
    writeFileSync("pages/database.html", BuatDatabase());
  }
}

function generateTag(path) {
  return path
    .replace(/\.html$/, "")
    .replace(/\.md$/, "")
    .replace(/^pages\//, "/")
    .replace(/^\/index$/, "/")
    .replaceAll("/_", "/:");
}

function generateId() {
  let acak = crypto.randomUUID().split("-")[0];
  return "v-" + acak;
}

let file = [];
let htmlFiles = fg.sync("pages/**/*.{html,md}");
async function mengolah() {
  for (let x of htmlFiles) {
    let isinya = readFileSync(x).toString();
    if (x.endsWith(".md")) {
      let jadiHtml = await mdjsProcess(isinya);
      let hasil = `
    <script>
        ${jadiHtml.jsCode.replace(/;$/, "")}
    </script>
    
    ${jadiHtml.html}
    `;
      isinya = hasil;
    }
    file.push({
      path: x,
      tag: generateTag(x),
      isinya,
      id: generateId(),
    });
  }
  tulisDiIndex(file);
}
mengolah();

function tulisDiIndex(file) {
  let konten = [];
  for (let x of file) {
    let script = "";
    let terlarang = "";
    let template = "";

    template = x.isinya;
    let patternScript =
      /(<script>\s+export default \{)([\s\S]+)(\};*\s+<\/script>)/;
    let dapatkanScript = template.match(patternScript);

    if (dapatkanScript) {
      script = dapatkanScript[0];
      template = template.replace(script, "");

      script = script.replace(
        patternScript,
        `<script>
routes.push({
    path: '${x.tag}',
    component: {
        template: '#${x.id}',
        $2
    }
});
</script>`
      );
    } else {
      script = `<script>
      routes.push({
          path: '${x.tag}',
          component: {
              template: '#${x.id}'
          }
      });
      </script>`;
    }

    let patternScriptTerlarang = /<script>[\s\S]+<\/script>/g;
    let scriptTerlarang = template.match(patternScriptTerlarang);
    if (scriptTerlarang) {
      template = template.replace(patternScriptTerlarang, "");
    } else {
      scriptTerlarang = [];
    }

    let patternScriptSrcTerlarang = /<script src=["'][\s\S]+["']><\/script>/g;
    let scriptSrcTerlarang = template.match(patternScriptSrcTerlarang);
    if (scriptSrcTerlarang) {
      template = template.replace(patternScriptSrcTerlarang, "");
    } else {
      scriptSrcTerlarang = [];
    }

    let patternStyleTerlarang = /<style>[\s\S]+<\/style>/g;
    let styleTerlarang = template.match(patternStyleTerlarang);
    if (styleTerlarang) {
      template = template.replace(patternStyleTerlarang, "");
    } else {
      styleTerlarang = [];
    }

    template = `<template id="${x.id}">${template}</template>`;

    terlarang = [
      ...scriptTerlarang,
      ...scriptSrcTerlarang,
      ...styleTerlarang,
    ].join("");

    konten.push(template + terlarang + script);
  }

  let index = readFileSync("index.html").toString();
  index = index
    .replace(
      /(<html\-vue>)([\s\S]+)(<\/html\-vue>)/,
      "$1" + konten.join("") + "$3"
    )
    .replace(/(<html\-vue>)(<\/html\-vue>)/, "$1" + konten.join("") + "$2");
  writeFileSync("index.html", index);
}
console.log("Aplikasi sudah siap");

watch(
  "pages/",
  {
    recursive: true,
  },
  async (evt, name) => {
    if (name.endsWith(".html") || name.endsWith(".md")) {
      let path = name.replaceAll("\\", "/");
      console.log(evt, name);
      if (evt == "update") {
        // on create or modify
        file = file.filter((x) => x.path != path);

        let isinya = readFileSync(path).toString();

        if (path.endsWith(".md")) {
          let jadiHtml = await mdjsProcess(isinya);
          let hasil = `
          <script>
              ${jadiHtml.jsCode.replace(/;$/, "")}
          </script>
          
          ${jadiHtml.html}
          `;
          isinya = hasil;
        }

        file.push({
          path: path,
          tag: generateTag(path),
          isinya,
          id: generateId(),
        });

        tulisDiIndex(file);
      }

      if (evt == "remove") {
        // on delete
        file = file.filter((x) => x.path != path);

        tulisDiIndex(file);
      }
    }
  }
);
