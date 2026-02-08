#!/bin/bash
echo "Setting up database..."
docker compose exec app php artisan migrate:fresh --seed
echo "Database setup completed!"
