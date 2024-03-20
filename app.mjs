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

function membuatFile(namaFile, konten) {
  if (!existsSync(namaFile)) {
    writeFileSync(namaFile, konten);
  }
}
async function membuatFileDownload(namaFile, link) {
  if (!existsSync(namaFile)) {
    let library = await fetch(
      link
    );
    library = await library.text();
    writeFileSync(namaFile, library);
  }
}
function membuatFolder(namaFolder) {
  if (!existsSync(namaFolder + "/")) {
    mkdirSync(namaFolder);
  }
}

membuatFolder("api");
membuatFolder("api/lib");
membuatFolder("api/pages");

membuatFile(".gitignore", "database.sqlite");
membuatFile(
  "index.php",
  `<?php
require './lib/minify.php';
$html = file_get_contents('./index.html');
echo minify_html($html);`
);
membuatFile("api/lib/router.php", BuatRouter());
membuatFile("api/pages/index.php", BuatIndexPagesPhp());
membuatFile("api/database.sqlite", "");
membuatFile("api/index.php", BuatIndexPhp());
membuatFile(
  "api/.htaccess",
  `<FilesMatch "database.sqlite">
Order Allow,Deny
Deny from all
</FilesMatch>

RewriteEngine On
RewriteCond %{REQUEST_URI} !(\.png|\.jpg|\.webp|\.gif|\.jpeg|\.zip|\.css|\.svg|\.js|\.pdf)$
RewriteRule (.*) index.php [QSA,L]`
);

membuatFileDownload('api/lib/rb.php', "https://raw.githubusercontent.com/mzaini30/redbean-sqlite/master/rb-sqlite.php");


membuatFolder('lib');
membuatFileDownload('lib/minify.php', 'https://gist.githubusercontent.com/Rodrigo54/93169db48194d470188f/raw/774c625080b43b858a9c99aca7ff3ae48819fbc5/php-html-css-js-minifier.php');
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
  membuatFileDownload(`lib/${lib.name}.js`, lib.link);
}
let libraryCss = [
  {
    name: "pico",
    link: "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css",
  },
];
for (let lib of libraryCss) {
  membuatFileDownload(`lib/${lib.name}.css`, lib.link);
}
membuatFile('index.html', BuatIndex());
membuatFolder('pages');
membuatFile('pages/index.html', /*html*/ `<h1>Hello World</h1>`);
membuatFile("pages/database.html", BuatDatabase());

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
      /(<html\-vue\s*>)([\s\S]+)(<\/html\-vue\s*>)/,
      "$1" + konten.join("") + "$3"
    )
    .replace(
      /(<html\-vue\s*>)(<\/html\-vue\s*>)/,
      "$1" + konten.join("") + "$2"
    );
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
