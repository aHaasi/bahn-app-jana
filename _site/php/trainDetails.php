<?php
$errors = array(); //To store errors
$form_data = array(); //Pass back the data

/* Validate the form on the server side */
if (empty($_POST['url'])) {
    $errors['url'] = 'Url cannot be blank';
}

if (empty($_POST['departureStation'])) {
    $errors['departure'] = 'departureStation cannot be blank';
}

if (empty($_POST['arrivalStation'])) {
    $errors['arrival'] = 'arrivalStation cannot be blank';
}

if (!empty($errors)) { //If errors in validation
    $form_data['success'] = false;
    $form_data['errors']  = $errors;
}
else { //If not, process the form, and return true on success
    $form_data['success'] = true;

    $html = file_get_contents($_POST['url']);
    $startIndex = strpos($html, '<table class="result stboard train');
    $endIndex = strpos($html, '</table>');
    $requiredTable = substr($html, $startIndex, $endIndex - $startIndex);

    libxml_use_internal_errors(true);
    $DOM = new DOMDocument;
    $DOM->loadHTML($requiredTable);

    libxml_use_internal_errors(false);

    //$form_data['html'] = strlen($html);

    $object = new stdClass();
    $object->id = $_POST['id'];

    $htmlItems= $DOM->getElementsByTagName('tr');

    foreach($htmlItems as $node) {
        $str = "";
        $htmlItemsTd = $node->childNodes;
        foreach ($htmlItemsTd as $element) {
            $str .= $element->nodeValue . ", ";
        }
        if(strpos($str, $_POST['departureStation']) !== false){
            $object->departure = $str;
        }
        if(strpos($str, $_POST['arrivalStation']) !== false){
            $object->arrival = $str;
        }

    }
    $form_data['data'] = $object;

}

//Return the data back to form.php
echo json_encode($form_data);

?>