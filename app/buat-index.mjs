export default function BuatIndex() {
  return /*html*/ `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HTML SPA</title>
    </head>
    
    <body>
        <style>
            [data-url] {
                display: none;
            }
        </style>

        <script src="./lib/petite-vue.js" defer init></script>
        <script src="./lib/alasql.js"></script>
        <script src="./lib/swal.js"></script>
    
        <div @vue:mounted="mounted" v-scope="{
              params: {},
              key: Date.now(),
          
              mounted(){
                this.redirect()
                this.updateParams();
                this.olahLink()
                window.addEventListener('hashchange', () => {
                  this.updateParams()
                    this.olahLink()
                  }
                  );
                },
                redirect(){
                let link = location.href;
                if (!link.includes('#')) {
                  location.href = '#/';
                }
              },
              updateParams(){
                let parameter = window.location.hash.substring(1).split('?')[1];
                if (parameter) {
                  let params = {};
                  let parts = parameter.split('&');
                  for (let part of parts) {
                    let [key, value] = part.split('=');
                    params[key] = decodeURIComponent(value);
                  }
                  this.params = params;
                }
              },
               olahLink(){
                 window.scrollTo(0, 0);
                 
                let linkHash = window.location.hash.substring(1).split('?')[0];
                document
                  .querySelectorAll('[data-url]')
                  .forEach((x) => (x.style.display = 'none'));
                  let terpilih = document.querySelector('[data-url=\\''+linkHash+'\\']')
                  if (terpilih){
  
                    terpilih.style.display =
                    'block';
                  }
              }
            }">
            <html-spa>
                <div data-url="/">
                    <h1>Hello World</h1>
                </div>
            </html-spa>
        </div>
    </body>
    
    </html>`;
}
