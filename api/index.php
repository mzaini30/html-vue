<?php

    include './lib/router.php';
    include './lib/rb.php';
    
    R::setup('sqlite:./database.sqlite');
    R::useFeatureSet('novice/latest');
    
    foreach (glob("pages/*.php") as $filename) {
        include $filename;
    }