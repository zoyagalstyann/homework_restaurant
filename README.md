# Restaurant Management System

Backend-ը PHP-ով, Database-ը MySQL-ով, կառավարում phpMyAdmin-ով (XAMPP):

## Տեղադրման հրահանգներ

### 1. XAMPP տեղադրում և կարգավորում

1. Ներբեռնեք և տեղադրեք XAMPP-ը: https://www.apachefriends.org/
2. Գործարկեք XAMPP Control Panel
3. Start արեք Apache և MySQL ծառայությունները

### 2. Database կարգավորում

1. Բացեք phpMyAdmin՝ http://localhost/phpmyadmin
2. Import արեք `database.sql` ֆայլը:
   - Սեղմեք "New" → ստեղծեք `restaurant_db` անունով database
   - Սեղմեք "Import" → ընտրեք `database.sql` ֆայլը
   - Սեղմեք "Go"

Այլ տարբերակ - SQL tab-ում copy-paste արեք `database.sql`-ի բովանդակությունը:

### 3. PHP Backend տեղադրում

1. Copy արեք ամբողջ project folder-ը XAMPP-ի `htdocs` թղթապանակում:
   ```
   C:\xampp\htdocs\restaurant-system
   ```

2. Վստահ եղեք, որ `api` folder-ը գտնվում է project-ի root-ում:
   ```
   htdocs/restaurant-system/
   ├── api/
   │   ├── config.php
   │   ├── db.php
   │   ├── cart.php
   │   ├── admin.php
   │   ├── menuitems.php
   │   ├── reservations.php
   │   └── orders.php
   ├── assets/
   ├── database.sql
   └── ...
   ```

### 4. Database կարգավորումներ

Եթե ձեր MySQL-ի username/password-ը տարբերվում են default-ից:

1. Խմբագրեք `.env` ֆայլը:
   ```
   DB_HOST=localhost
   DB_NAME=restaurant_db
   DB_USER=root
   DB_PASS=your_password_here
   ```

2. Կամ ուղղակի փոխեք `api/config.php` ֆայլում:

### 5. Frontend կարգավորում

Frontend-ը ավտոմատ կզարգացված է PHP API-ի հետ աշխատելու համար:

Բացեք browser-ում:
```
http://localhost/restaurant-system/index.html
```

## API Endpoints

Բոլոր API-ները գտնվում են `http://localhost/homework_restaurant/api/`:

### Cart API
- `GET /api/cart.php?session_id={id}` - Ստանալ զամբյուղը
- `POST /api/cart.php` - Պահպանել զամբյուղը

### Admin API
- `GET /api/admin.php?session_token={token}` - Ստուգել login
- `POST /api/admin.php` - Login
- `PUT /api/admin.php` - Update session
- `DELETE /api/admin.php` - Logout

### Menu Items API
- `GET /api/menuitems.php` - Բոլոր menu items
- `GET /api/menuitems.php/{id}` - Մեկ item
- `POST /api/menuitems.php` - Ստեղծել նոր item
- `PUT /api/menuitems.php/{id}` - Update item
- `DELETE /api/menuitems.php/{id}` - Ջնջել item

### Reservations API
- `GET /api/reservations.php` - Բոլոր ամրագրումները
- `POST /api/reservations.php` - Նոր ամրագրում

### Orders API
- `GET /api/orders.php` - Բոլոր պատվերները
- `POST /api/orders.php` - Նոր պատվեր

## Admin Login

- Username: admin
- Password: admin123

## Database Աղյուսակներ

1. **cart_sessions** - Օգտատերերի զամբյուղների տվյալներ
2. **admin_sessions** - Admin login sessions
3. **menu_items** - Ռեստորանի menu
4. **reservations** - Սեղանի ամրագրումներ
5. **orders** - Պատվերներ

## Խնդիրների լուծում

### CORS սխալներ
Եթե տեսնում եք CORS սխալներ, ստուգեք `api/config.php`-ում CORS headers-ը:

### Database connection սխալներ
1. Ստուգեք, որ MySQL-ը running է XAMPP-ում
2. Ստուգեք `.env` կամ `api/config.php` կարգավորումները
3. Ստուգեք, որ `restaurant_db` database-ը ստեղծված է

### API-ները չեն աշխատում
1. Ստուգեք Apache-ը running է
2. Ստուգեք URL-ը՝ `http://localhost/restaurant-system/api/menuitems.php`
3. Նայեք browser console-ին սխալների համար

## Frontend-ի փոփոխություններ

Frontend-ը թարմացված է PHP API-ի հետ աշխատելու համար:

- `assets/js/api-client.js` - API integration
- `assets/js/menu.js` - Shopping cart ֆունկցիոնալություն
- `assets/js/admin.js` - Admin panel
- `assets/js/main.js` - API requests

Բոլոր localStorage կանչերը փոխարինված են MySQL database calls-ով PHP backend-ի միջոցով:
