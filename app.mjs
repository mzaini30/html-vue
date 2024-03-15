#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import BuatIndex from "./app/buat-index.mjs";
import BuatDatabase from "./app/buat-database.mjs";
import fg from "fast-glob";
import watch from "node-watch";
import crypto from 'crypto';

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
  ];
  for (let lib of library) {
    if (!existsSync(`lib/${lib.name}.js`)) {
      fetch(lib.link)
        .then((x) => x.text())
        .then((x) => writeFileSync(`lib/${lib.name}.js`, x));
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
    .replace(/^pages\//, "/")
    .replace(/^\/index$/, "/")
    .replaceAll('/_', '/:');
}

function generateId() {
  let acak = crypto.randomUUID().split('-')[0];
  return 'v-' + acak;
}

let file = [];
let htmlFiles = fg.sync("pages/**/*.html");
for (let x of htmlFiles) {
  file.push({
    path: x,
    tag: generateTag(x),
    isinya: readFileSync(x).toString(),
    id: generateId()
  });
}
tulisDiIndex(file);

function tulisDiIndex(file) {
  let konten = [];
  for (let x of file) {
    konten.push(/*html*/ `
      <template id="${x.id}">
          <div>Home</div>
          <p>Menuju ke <router-link to="/about">About</router-link></p>
      </template>

      <script>
        routes.push({
            path: '${x.tag}',
            component: {
                template: '#${x.id}',
                mounted() {
                    console.log('Ini di beranda');
                }
            }
        });
      </script>
    `);
    // konten.push(/*html*/ `
    //         <div data-url="${x.tag}">
    //             ${x.isinya}
    //         </div>
    //     `);
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
  (evt, name) => {
    if (name.endsWith('.html')) {
      let path = name.replaceAll("\\", "/");
      console.log(evt, name);
      if (evt == "update") {
        // on create or modify
        file = file.filter((x) => x.path != path);

        file.push({
          path: path,
          tag: generateTag(path),
          isinya: readFileSync(path).toString(),
          id: generateId()
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
