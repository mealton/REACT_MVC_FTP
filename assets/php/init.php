<?php

require_once __DIR__ . '/React.php';
$react = new React(array('method' => 'init'));
$hash = file_get_contents(__DIR__ . '/data.json');
$Data =  trim($hash) ? $hash : json_encode($react->getData());
$Data_php = json_decode($Data, 1);
$path = array_values(array_diff(explode('/', $_SERVER['REQUEST_URI']), array('')));

switch (1) {
    case ($path[0] == 'publication' && $path[1]):
        $title = $Data_php['publications'][$path[1]]['short_title'];
        $description = $Data_php['publications'][$path[1]]['description'];
        break;
    case ($path[0] == 'category' && $path[1]):
        $title = $Data_php['rubrics'][$path[1]]['rubric_name'];
        $description = $title;
        break;
    case ($path[0] == 'hashtags' && $path[1]):
        $description = $title = '#' . $Data_php['id_hashtags'][$path[1]]['hashtag'];
        break;
    case ($path[0] == '-search' && $path[1]):
        $description = $title = '#' . $path[1];
        break;
    default:
        $title = 'Все публикации';
        $description = 'Публикации';
}
?>
<script>
    let Data = <?= $Data ?>;
</script>



