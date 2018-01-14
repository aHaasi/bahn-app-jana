# README

## install
sudo apt-get install apache2
sudo apt-get install php5 libapache2-mod-php5
sudo apt-get install php5-curl
sudo /etc/init.d/apache2 restart
sudo apt-get install xscreensaver (für das Ausschalten des Bildschirmes)


vim copySite.sh
chmod +x copySite.sh

copySite.sh bearbeiten und folgendes einfügen:
#!/bin/bash
sudo rm /var/wwww/html/currentTrains.php
sudo rm /var/www/html/trainDetails.php
sudo rm -r /var/www/html/raspberry-app/
sudo cp -R _site /var/www/html
sudo mv /var/www/html/_site/ /var/www/html/raspberry-app
sudo cp php/trainDetails.php /var/www/html/
sudo cp php/currentTrain.php /var/www/html/


## start
- start app with XAMPP
- call URL: http://localhost/bahn-app-jana/_site/index.html

## compile
- cd <folder-of-app>
- jekyll serve (generate the files in _site)
