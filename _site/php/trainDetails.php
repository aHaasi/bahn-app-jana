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

    $curl_handle = curl_init();
    curl_setopt( $curl_handle, CURLOPT_URL, $_POST['url']);
    curl_setopt( $curl_handle, CURLOPT_RETURNTRANSFER, true ); // Fetch the contents too
    $html = curl_exec( $curl_handle ); // Execute the request
    curl_close( $curl_handle );

    $form_data['id'] = $_POST['id'];
    $form_data['html'] = $html;

}

//Return the data back to form.php
echo json_encode($form_data);

?>