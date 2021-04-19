<?php

require_once __DIR__ . '/lib.php';

class React extends Fetch
{
    public function init()
    {
    }

    protected function getRadioTitle($data)
    {
        $title = strval(trim($data['title']));
        if (!$title) {
            json(array('title' => false));
            return false;
        }
        switch ($title) {
            case ("Absolute 70's Pop Radio"):
                $content = curl('https://onlineradiobox.com/ch/1fmabsolute70popradio/playlist/?lang=en');
                $content = substr($content, strpos($content, '<tr	class="active">'));
                $title = substr($content, strpos($content, '<td>'));
                $title = substr($title, 0, strpos($title, '</td>'));
                $title = strip_tags(htmlspecialchars_decode($title));
                break;
            case("Кузбасс ФМ"):
                $content = curl('http://kuzbassfm.ru');
                $content = substr($content, strpos($content, '<li class="now">'));
                $content = substr($content, 0, strpos($content, '<li class="old">'));
                //$time = substr($content, strpos($content, '<strong class="time">') + 21);
                //$time = substr($time, 0, strpos($time, '</strong>'));
                $title = substr($content, strpos($content, '<div>') + 5);
                $title = str_replace('<br/>', ' - ', substr($title, 0, strpos($title, '</div>')));
                break;
            default:
                $title = false;
        }
        json(array('title' => $title));
        return true;
    }

    public function getData()
    {
        $publications = $this->getter('publications', array('status' => 1));
        $publications_content = $this->getter('publications_content');
        $publications_content = extract_fetch_array($publications_content, 'publication_id');
        $rubrics = $this->getter('rubrics', array('status' => 1));
        $music = $this->getter('music', array('status' => 1, 'user_id' => 1));
        $music_albums = array_keys(extract_fetch_array($music, 'album'));
        $hashtags = $this->getter('hashtags');
        $comments = database::getInstance()->Select('SELECT * FROM `comments` WHERE `status` = 1 ORDER BY `date` DESC');
        $comments = extract_fetch_array($comments, 'post_id');
        $tags = extract_fetch_array($hashtags, 'public_id');
        $tagsPublics = extract_fetch_array($hashtags, 'hashtag');
        $id_hashtags = id_array($hashtags);

        $sql = 'SELECT 
                    `id`, 
                    IF(`image_default` = "", 
                        (SELECT `content` 
                            FROM `publications_content` 
                            WHERE 
                                `publication_id` = `p`.`id` AND
                                `tag_category` = "image" AND 
                                `content` != "" 
                            ORDER BY RAND() LIMIT 1), 
                        `image_default`) as `img`, 
                     `short_title` as `title`, 
                     `likes`, `views`
                 FROM `publications` as `p`
                 WHERE 
                    `status` = 1 AND 
                    `category` != 5
                 ORDER BY 
                    `likes` DESC, 
                    `views` DESC
                 LIMIT 30';

        $popular = database::getInstance()->Select($sql);


        foreach ($publications as $i => $publication) {

            if ($publication['category'] == 5) {
                unset($publications[$i]);
                continue;
            }

            $publications[$i]['content'] = $publications_content[$publication['id']];
            $publications[$i]['image_random'] = $this->random_img($publications_content[$publication['id']]);
            $publications[$i]['tags'] = is_array($tags[$publication['id']]) ? $tags[$publication['id']] : array();
            $publications[$i]['comments'] = is_array($comments[$publication['id']]) ? $comments[$publication['id']] : array();
        }

        $publications = id_array(array_reverse($publications));

        unset($tagsPublics['']);
        foreach ($tagsPublics as $tag => $fetch) {
            $tagsPublics[$tag] = array();
            foreach (fetch_to_array($fetch, 'public_id') as $id) {
                if ($publications[$id])
                    $tagsPublics[$tag][$id] = $publications[$id];
            }
        }


        return array(
            'publications' => $publications,
            'rubrics' => id_array($rubrics),
            'music' => array_reverse($music),
            'musicAlbums' => $music_albums,
            'popular' => $popular,
            'tags' => $tags,
            'tagsPublics' => $tagsPublics,
            'id_hashtags' => $id_hashtags
        );
    }


    private function random_img($array)
    {
        $images = array();
        if (!is_array($array))
            return false;
        foreach ($array as $row) {
            if ($row['tag_category'] == 'image' && $row['content'])
                $images[] = $row['content'];
        }
        shuffle($images);
        return $images[0];
    }

    protected function like($data)
    {
        $sql = 'UPDATE `publications` SET `likes` = `likes` + 1 WHERE `id` = ' . $data['id'];
        json(array(
            'result' => database::getInstance()->Query($sql),
            'data' => $this->getter('publications', array('id' => $data['id']), 'likes')
        ));
    }

    protected function views($data)
    {
        $sql = 'UPDATE `publications` SET `views` = `views` + 1 WHERE `id` = ' . $data['id'];
        json(array(
            'result' => database::getInstance()->Query($sql),
            'data' => $this->getter('publications', array('id' => $data['id']), 'views')
        ));
    }


    protected function addComment($data)
    {
        $id = $this->insert('comments', $data);
        json(array(
            'result' => $id,
            'data' => $this->getter('comments', array('id' => $id))
        ));
    }
}


fetch_init('React');