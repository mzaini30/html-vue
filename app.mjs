#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import BuatIndex from "./app/buat-index.mjs";
import BuatDatabase from "./app/buat-database.mjs";
import fg from "fast-glob";
import watch from "node-watch";

if (!existsSync("lib/")) {
  mkdirSync("lib");
  let library = [
    {
      name: "vue",
      link: "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.iife.js",
    },
    {
      name: "vue-router",
      link: "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.iife.js",
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
    .replace(/^\/index$/, "/");
}

let file = [];
let htmlFiles = fg.sync("pages/**/*.html");
for (let x of htmlFiles) {
  file.push({
    path: x,
    tag: generateTag(x),
    isinya: readFileSync(x).toString(),
  });
}
tulisDiIndex(file);

function tulisDiIndex(file) {
  let konten = [];
  for (let x of file) {
    konten.push(/*html*/ `
            <div data-url="${x.tag}">
                ${x.isinya}
            </div>
        `);
  }

  let index = readFileSync("index.html").toString();
  index = index
    .replace(
      /(<html\-spa>)([\s\S]+)(<\/html\-spa>)/,
      "$1" + konten.join("") + "$3"
    )
    .replace(/(<html\-spa>)(<\/html\-spa>)/, "$1" + konten.join("") + "$2");
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
