<?php

class Fetch
{

    public function __construct($data)
    {
        require_once __DIR__ . '/config.php';
        /**
         * @var $config array
         */
        $method = strval($data['method']);
        if (!method_exists($this, $method)) {
            json(array('result' => false, 'message' => 'Запрашиваемый метод отсутствует', 'data' => $data));
            return false;
        } else {
            require_once __DIR__ . '/database.class.php';
            database::getInstance()->Connect($config['username'], $config['password'], $config['db_name'], $config['host']);
            $this->$method($data);
        }
        return true;
    }

    protected function check_existence($tablename, $data)
    {
        if (!is_array($data) || empty($data))
            return false;

        $columns = $this->get_table_fields($tablename);

        $sql = 'SELECT * FROM `' . $tablename . '` WHERE ';

        foreach ($data as $field => $value) {
            if (in_array($field, $columns))
                $sql .= '`' . $field . '` = "' . str_replace('"', '\"', $value) . '" ' . ($value != end($data) ? ' AND ' : '');
        }
        $sql .= ' LIMIT 1';
        $fetch = database::getInstance()->Select($sql);
        return !empty($fetch);
    }

    protected function get_table_fields($table_name)
    {
        $columns = database::getInstance()->Select(' SHOW COLUMNS FROM `' . $table_name . '`');
        return fetch_to_array($columns, 'Field');
    }

    protected function insert($table_name, $data, $multiple_insert = false)
    {
        if (!$table_name || !is_array($data))
            return false;

        $columns = $this->get_table_fields($table_name);
        $fields = $values = '';
        if (!$multiple_insert) {
            $values .= '(';
            $data = is_array($data[0]) ? $data[0] : $data;
            foreach ($data as $field => $value) {
                if (in_array($field, $columns)) {
                    $fields .= '`' . $field . '`,';
                    $values .= '"' . str_replace('"', '\"', $value) . '",';
                }
            }
            $values = trim($values, ',') . '),';
        } else {
            foreach ($data as $i => $row) {
                if (!is_array($row))
                    continue;
                $values .= '(';
                foreach ($row as $field => $value) {
                    if (in_array($field, $columns)) {
                        if ($i == 0)
                            $fields .= '`' . $field . '`,';
                        $values .= '"' . $value . '",';
                    }
                }
                $values = trim($values, ',') . '),';
            }
        }
        $sql = 'INSERT INTO `' . $table_name . '` (' . trim($fields, ',') . ') VALUES ' . trim($values, ',');
        return database::getInstance()->QueryInsert($sql);
    }

    protected function update($table_name, $data, $identifier_value, $identifier = 'id')
    {
        if (!$table_name || !is_array($data) || empty($data) || !$identifier_value)
            return false;

        $columns = $this->get_table_fields($table_name);

        if (!in_array($identifier, $columns))
            return false;

        $sql = 'UPDATE `' . $table_name . '` SET ';

        foreach ($data as $field => $value) {
            if (in_array($field, $columns))
                $sql .= '`' . $field . '` = "' . str_replace('"', '\"', $value) . '",';
        }

        $sql = trim($sql, ',');

        $sql .= ' WHERE `' . $identifier . '` = "' . $identifier_value . '"';

        $result = database::getInstance()->Query($sql);

        return $result ?
            database::getInstance()
                ->Select('SELECT `' . implode('`, `', array_keys($data)) . '` FROM `' . $table_name . '` 
                                WHERE `' . $identifier . '` = "' . $identifier_value . '"') : $result;
    }

    protected function delete($table_name, $identifier_value, $identifier = 'id')
    {
        if (!$table_name || !$identifier_value)
            return false;

        $columns = $this->get_table_fields($table_name);

        if (!in_array($identifier, $columns))
            return false;

        $sql = 'DELETE FROM `' . $table_name . '` WHERE `' . $identifier . '` = "' . $identifier_value . '"';
        return database::getInstance()->Query($sql);
    }


    public function getter($tablename, $data = array(), $fields = '*')
    {
        if (!$tablename || !is_array($data))
            return false;

        fields:
        if (is_array($fields))
            $fields = '`' . implode('`, `', $fields) . '`';
        elseif (strval($fields) && $fields != '*') {
            $fields = explode(',', $fields);
            goto fields;
        }

        $columns = $this->get_table_fields($tablename);

        $where = '';

        if (!empty($data)) {
            $where .= ' WHERE ';
            foreach ($data as $field => $value) {
                if (in_array($field, $columns))
                    $where .= '`' . $field . '` = "' . $value . '"' . ($field != end(array_keys($data)) ? ' AND ' : '');
            }
        }
        $sql = 'SELECT ' . $fields . ' FROM `' . $tablename . '`' . $where;
        return database::getInstance()->Select($sql);
    }
}

//Emails для рассылки писем
$emails_to_send_letters = array(
    'yury' => 'titov_yw@mail.ru',
    'alex' => 'alex@fluid-line.ru',
    'avp' => 'avp@fluid-line.ru',
    'managers' => 'mail@fluid-line.ru'
);

$mailganer_api_key = '4e255e71d5efaf49ccd65f8d55b709a9';


function get_some_array_fields($array, $fields)
{
    $fields = is_array($fields) ? $fields : array($fields);
    $result = array();
    foreach ($array as $key => $value) {
        if (in_array($key, $fields))
            $result[$key] = $value;
    }
    return $result;
}

function fetch_init($className)
{
    $className = strtoupper($className);
    if (!empty($_FILES)) {
        if (method_exists($className, 'upload_files'))
            $className::upload_files($_FILES);
        return true;
    }
    $ajax_data = file_get_contents('php://input');
    if (!$ajax_data)
        return false;
    return new $className(json_decode($ajax_data, 1));
}

function json($data)
{
    echo json_encode($data);
}

function pre($data)
{
    echo '<pre>';
    print_r($data);
    echo '</pre>';
}

function parse_excel($filename, $assoc = false)
{
    require_once __DIR__ . '/PHPExcel-1.8/Classes/PHPExcel.php';
    $file_type = PHPExcel_IOFactory::identify($filename);
    $objReader = PHPExcel_IOFactory::createReader($file_type);
    $objPHPExcel = $objReader->load($filename); // загружаем данные файла в объект
    $sheet = $objPHPExcel->getActiveSheet();

    $array = $sheet->toArray();

    if (!$assoc)
        return $array;

    $headers = array_shift($array);
    $result = array();

    foreach ($array as $row) {
        foreach ($row as $i => $value)
            $row_temp[$headers[$i]] = $value;
        $result[] = $row_temp;
    }
    return $result;
}

function fetch_to_array($fetch, $field = false)
{
    $result = array();
    if (!in_array($field, array_keys(current($fetch))))
        $field = false;
    foreach ($fetch as $row)
        $result[] = $field ? $row[$field] : current($row);
    return $result;
}

function date_rus_format($date, $time = false)
{
    $date = date_parse($date);
    $months = array(1 => 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря');
    return $date['day'] . ' ' . $months[$date['month']] . ' ' . $date['year'] . ' г.' .
        ($time ? ' в ' . $date['hour'] . ':' . (intval($date['minute']) < 10 ? '0' . $date['minute'] : $date['minute']) : '');
}

function current_ending($count, $endings = array())
{
    switch (1) {
        case ($count % 10 == 1 && $count % 100 != 11):
            $result = $endings[0];
            break;
        case (in_array($count % 10, array(2, 3, 4)) && !in_array($count % 100, array(12, 13, 14))):
            $result = $endings[1];
            break;
        default:
            $result = $endings[2];
    }
    return $result;
}

function translit($string)
{
    $abc = array(
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'e', 'ж' => 'j', 'з' => 'z',
        'и' => 'i', 'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r',
        'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch',
        'ъ' => '\'', 'ы' => 'y', 'ь' => '\'', 'э' => 'e', 'ю' => 'ju', 'я' => 'ja'
    );

    $translit = '';
    $string = preg_split('//u', $string, -1, PREG_SPLIT_NO_EMPTY);

    foreach ($string as $char) {
        if (preg_match('/\p{Cyrillic}/ui', $char))
            $translit .= $abc[mb_strtolower($char)];
        else
            $translit .= mb_strtolower($char);
    }

    $translit = preg_replace('/\s+/', '-', $translit);
    $translit = preg_replace('/(–|-){2,}/', '-', $translit);
    return preg_replace('/[^a-z\d+\-\']/', "", trim($translit, '-'));
}

function textCutter($string, $char_limit = 15)
{
    $string = trim(strip_tags($string));
    return
        mb_strwidth($string, 'utf-8') > $char_limit + 10 ?
            mb_substr($string, 0, $char_limit, "utf-8") . '...'
            : $string;
}


function mailSender($to, $subject, $message)
{
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: admin@mealton.ru \r\n";
    mail($to, $subject, $message, $headers);
}

function getAge($birthday)
{
    $age = floor((time() - strtotime($birthday)) / (3600 * 24 * 365));
    return $age . ' ' . current_ending($age, array('год', 'года', 'лет'));
}

function getPeriod($date)
{
    $period = (time() - strtotime($date)) / (3600 * 24);

    switch (1) {
        case $period < 1:
            return ' менее суток';
            break;
        case ($period / intval(date('t')) < 1):
            return ' менее месяца';
            break;
        case ($period / 365 < 1):
            return ceil($period / 30) . ' ' . current_ending(ceil($period / 30), array('месяц', 'месяца', 'месяцев'));
            break;
        case ($period / 365 > 1):
            $years = floor($period / 365) . ' ' . current_ending(floor($period / 365), array('год', 'года', 'лет'));
            $monthes = floor($period % 365 / 30) > 0 ?
                ' и ' . floor($period % 365 / 30) . ' ' . current_ending(ceil($period % 365 / 30), array('месяц', 'месяца', 'месяцев')) : '';
            return $years . $monthes;
            break;
    }

    return 'неопределенное время';
}

function get_date($timestamp)
{
    return current(explode(' ', $timestamp));
}


function curl($url, $cookie = false)
{
    $url = urldecode($url);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    if ($cookie)
        curl_setopt($ch, CURLOPT_COOKIE, $cookie);

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_AUTOREFERER, 0);

    $result = curl_exec($ch);
    curl_close($ch);

    return $result;

}


function curl_query($url, $query = array(), $headers = array())
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

function curl_get($url, $headers = array())
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}


function file_force_download($file_path, $filename = false, $ctype = false)
{
    header('Content-Description: File Transfer');
    header('Content-Type: ' . ($ctype ? $ctype : 'application/octet-stream'));
    header('Content-Disposition: attachment; filename="' . ($filename ? $filename : basename($file_path)) . '"');
    header('Content-Transfer-Encoding: binary');
    header('Content-Length: ' . filesize($file_path));

    readfile($file_path);
}


function array_trimmer($data)
{
    foreach ($data as $i => $item)
        $data[$i] = trim(preg_replace('/\s{2,}/', ' ', strval(strip_tags($item))));

    return $data;
}


function textWrapper($text, $char_limit = 100)
{
    return
        mb_strwidth($text, 'utf-8') > $char_limit + 30 ? //Если длинна текста превышает заданный лимит более чем на 30 знаков
            mb_substr($text, 0, $char_limit, "utf-8")
            . '<span class="hidden">' . mb_substr($text, $char_limit, mb_strwidth($text, 'utf-8') - $char_limit, 'utf-8') . '</span>'
            . '<span class="details"> <span class="inner white-space-nowrap" onclick="textLimit(this)"><span class="inner-text">Развернуть</span> <i class="fa fa-caret-down" aria-hidden="true"></i></span></span>'
            : $text;
}


function csv_generate($data, $headers, $filename)
{
    header("Content-type: text/csv");
    header("Content-Disposition: attachment; filename=$filename.csv");
    header("Pragma: no-cache");
    header("Expires: 0");

    $buffer = fopen('php://output', 'w');
    fputs($buffer, chr(0xEF) . chr(0xBB) . chr(0xBF));
    fputcsv($buffer, $headers, ';');
    foreach ($data as $val) {
        fputcsv($buffer, $val, ';');
    }
    fclose($buffer);
    exit();
}


function mailer($subject, $message, $to = "titov_yw@mail.ru")
{
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From:mail@fluid-line.ru \r\n";

    return mail($to, $subject, $message, $headers);
}


function upload_img_by_url($url, $path)
{
    header("Content-type: image/jpeg");
    $image = curl($url);
    file_put_contents($path, $image);
    return file_exists($path) && filesize($path) ? str_replace($_SERVER['DOCUMENT_ROOT'], '', $path) : false;
}


function upload_files($files, $upload_dir, $rename = 1)
{
    $uploaded = array();

    for ($i = 0; $i < count($files['file']['tmp_name']); $i++) {
        $fileName = $rename ? time() . rand(0, 10000) . time() . '.jpg' : $files['file']['name'][$i];
        move_uploaded_file($files['file']['tmp_name'][$i], $upload_dir . '/' . $fileName);
        array_push($uploaded, str_replace($_SERVER['DOCUMENT_ROOT'], '', $upload_dir . '/' . $fileName));
    }

    return $uploaded;
}


function get_current_url()
{
    return 'http' . ($_SERVER['HTTPS'] ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
}


function get_ob_content($file, $data = array())
{

    if (!is_array($data) || !file_exists($file))
        return false;

    foreach ($data as $k => $v)
        $$k = $v;

    ob_start();
    include $file;
    $html = ob_get_contents();
    ob_clean();

    return $html;
}


function get_hash_string($lenght)
{
    $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return substr(str_shuffle($permitted_chars), 0, $lenght);
}


function extract_fetch_array($array, $field = 'id')
{
    if (!is_array($array))
        return array();
    $result = array();
    foreach ($array as $row) {
        if ($result[$row[$field]])
            $result[$row[$field]][] = $row;
        else
            $result[$row[$field]] = array($row);
    }
    return $result;
}

function id_array($fetch)
{
    if (!is_array($fetch))
        return array();
    $result = array();
    foreach ($fetch as $row)
        $result[$row['id']] = $row;
    return $result;
}
