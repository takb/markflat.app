<?php
$ret = [];
if ($handle = opendir('./mb')) {
    while (false !== ($entry = readdir($handle))) {
        $finfo = pathinfo($entry);
        if ($finfo['extension'] == "mb") {
            $md = file_get_contents('./mb/'.$entry);
            if (preg_match('/#(.+?) - (.+?)( \(.+?\))?\R.*/us', $md, $content) || true) {
                array_push($ret, array(
                    'title' => trim($content[1]),
                    'artist' => trim($content[2]),
                    'md' => $md,
                ));
            } else {
                echo $md;
            }
        }
    }
    closedir($handle);
}
echo json_encode($ret);
?>