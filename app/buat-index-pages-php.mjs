export default function BuatIndexPagesPhp() {
  return /*php*/ `<?php

    get('/', function () {
        echo 'hello world';
    });`;
}
