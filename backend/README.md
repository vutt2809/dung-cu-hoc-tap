sudo cp backend/vhost.conf /etc/apache2/sites-available/dung-cu-hoc-tap.conf
sudo a2ensite dung-cu-hoc-tap.conf
sudo a2enmod rewrite
sudo systemctl reload apache2

127.0.0.1 dung-cu-hoc-tap.local

php backend/artisan migrate:fresh --seed

php artisan storage:link

php artisan db:seed --class=ProductsFromImagesSeeder