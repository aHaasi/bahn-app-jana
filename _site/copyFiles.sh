#!/bin/bash
sudo rm /var/www/html/currentTrains.php 
sudo rm /var/www/html/trainDetails.php 
sudo rm -r /var/www/html/bahn-app-jana/ 
sudo cp -R _site /var/www/html 
sudo mv /var/www/html/_site/ /var/www/html/bahn-app-jana
sudo cp php/trainDetails.php /var/www/html/ 
sudo cp php/currentTrains.php /var/www/html/
