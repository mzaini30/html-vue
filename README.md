# Future Web

Membuat website itu harusnya sesimpel ini.

## Install

```bash
npm i -g future-web
```

## Menjalankan

```bash
web
```

Nanti otomatis akan menjalankan mode watch. Jadi, udah sih, perintahnya `web` aja. Nggak ada tambahan lain.

## Library yang Udah Otomatis Ter-include

- AlaSQL
- Swal
- Vue Router
- Vue

## Struktur Direktori

Semua file kita masukkan di folder `pages`.

| File         | Ter-render |
| ------------ | ---------- |
| index.html   | /          |
| about.html   | /about     |
| tentangku.md | /tentangku |
| \_id.html    | /:id       |

## Memasukkan Kode Vue di HTML

Pakai `export default`.

```html
<script>
  export default {
    mounted() {
      console.log("Hello World");
    },
  };
</script>

<h1>Hello World</h1>
```

## Memasukkan Kode Vue di Markdown

Pakai kode `js script`:

````markdown
```js script
export default {
  mounted() {
    console.log("Hello World");
  },
};
```

# Hello World

Ini adalah isinya
````
