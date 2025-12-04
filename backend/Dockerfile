FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    zip unzip curl \
    && docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www

COPY composer.json composer.lock /var/www/
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-scripts

COPY . /var/www
RUN composer dump-autoload

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
