<?php

require_once __DIR__ . '/React.php';
$react = new React(array('method' => 'init'));
$Data = $react->getData();
$path = array_values(array_diff(explode('/', $_SERVER['REQUEST_URI']), array('')));

switch (1) {
    case ($path[0] == 'publication' && $path[1]):
        $title = $Data['publications'][$path[1]]['short_title'];
        $description = $Data['publications'][$path[1]]['description'];
        break;
    case ($path[0] == 'category' && $path[1]):
        $title = $Data['rubrics'][$path[1]]['rubric_name'];
        $description = 'Публикации категории ' . $title;
        break;
    case ($path[0] == 'hashtags' && $path[1]):
        $description = $title = 'Публикации с меткой #' . $Data['id_hashtags'][$path[1]]['hashtag'];
        break;
    case ($path[0] == '-search' && $path[1]):
        $description = $title = 'Поиск публикаций, сожержащих #' . $path[1];
        break;
    default:
        $title = 'Все публикации';
        $description = 'Публикации';
}
?>
<script>
    let Data = <?= json_encode($Data) ?>;
</script>



