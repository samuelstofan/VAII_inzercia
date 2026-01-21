### Na vytvorenie tejto aplikacie bola vyuzita generativna AI

### 1) Konfiguracne subory (.env)
Backend (`backend/.env`) do example doplnit:
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=inzercia_mysql
DB_PORT=3306
DB_DATABASE=inzercia
DB_USERNAME=root
DB_PASSWORD=root

SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173

- S3(napiste mi na teams pre prava stofan3@stud.uniza.sk):
  - `FILESYSTEM_DISK=s3`
  - `AWS_ACCESS_KEY_ID=...`
  - `AWS_SECRET_ACCESS_KEY=...`
  - `AWS_DEFAULT_REGION=...`
  - `AWS_BUCKET=...`

Frontend (`frontend/.env`):
  - `VITE_API_URL=http://localhost:8000`

### 2) Build a spustenie kontajnerov
Z korena projektu:
docker compose up --build -d

### 3) Inicializacia Laravelu
Backend kontajner:
docker exec -it inzercia_backend bash

Potom v kontajneri:
php artisan key:generate
php artisan migrate --seed


### 4) Overenie
- Frontend: http://localhost:5173
- Backend (nginx): http://localhost:8000 <-404
- phpMyAdmin: http://localhost:8080

