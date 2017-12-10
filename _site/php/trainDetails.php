<?php
$errors = array(); //To store errors
$form_data = array(); //Pass back the data

/* Validate the form on the server side */
if (empty($_POST['url'])) {
    $errors['url'] = 'Url cannot be blank';
}

if (!empty($errors)) { //If errors in validation
    $form_data['success'] = false;
    $form_data['errors']  = $errors;
}
else { //If not, process the form, and return true on success
    $form_data['success'] = true;
    $form_data['bla'] = true;

    //$curl_handle = curl_init();
    //curl_setopt( $curl_handle, CURLOPT_URL, $_POST['url']);
    //curl_setopt( $curl_handle, CURLOPT_RETURNTRANSFER, true ); // Fetch the contents too
    //$html = curl_exec( $curl_handle ); // Execute the request
    //curl_close( $curl_handle );

    $html = file_get_contents($_POST['url']);
    $startIndex = strpos($html, '<table class="result stboard train');
    $endIndex = strpos($html, '</table>');

    $form_data['id'] = $_POST['id'];
    //$form_data['html'] = strlen($html);
    //$form_data['html'] = substr($html, $startIndex, $endIndex);

    foreach($html->find('tr') as $row) {
   // Parse table row here
        $time = $row->find('td',0)->plaintext;
    }

}

//Return the data back to form.php
echo json_encode($form_data);

?>