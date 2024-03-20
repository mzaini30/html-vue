<?php
require './lib/minify.php';
$html = file_get_contents('./index.html');
echo minify_html($html);