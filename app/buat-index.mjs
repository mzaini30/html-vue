export default function BuatIndex() {
  return /*html*/ `<!DOCTYPE html>
  <html lang="id">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Future Web</title>
  </head>
  
  <body>
      <script src="./lib/vue.js"></script>
      <script src="./lib/vue-router.js"></script>
      <script src="./lib/alasql.js"></script>
      <script src="./lib/swal.js"></script>
      <script src="./lib/db.js"></script>
      <link rel="stylesheet" href="./lib/pico.css">

      <style>
        body {
            padding: 20px;
        }
      </style>

      <script>
        let routes = [];
      </script>
  
      <div id="app">
          <router-view></router-view>
      </div>
  
      <html-vue>
      </html-vue>
  
      <script>
  
  
          const router = VueRouter.createRouter({
              history: VueRouter.createWebHashHistory(),
              routes,
          });
  
          const app = Vue.createApp({});
          app.use(router);
          app.mount('#app');
  
      </script>
  </body>
  
  </html>`;
}
