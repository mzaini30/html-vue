export default function BuatIndexPagesPhp() {
  return /*php*/ `<?php

    get('/api', function () {
        echo 'hello world';
    });`;
}
