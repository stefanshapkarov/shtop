# SHTOP

Carpooling web application, written in Laravel and React.js.

This is an open-source project for a faculty course @ FCSE in Skopje. It is a team project between 5 students.

 ## Project structure

```
├── backend/             # Laravel backend code
│   ├── app/             # Application logic
│   ├── config/          # Configuration files
│   ├── database/        # Migrations and seeders
│   └── routes/          # API routes
├── frontend/            # React frontend code
│   ├── src/             # Source files for React components
│   ├── public/          # Static assets
│   └── .env             # Frontend environment configuration
└── README.md            # Project documentation
```

## Tech Stack

**Client:** React ^18.3.1, Mui ^5.16.0

**Server:** Php ^8.1, Laravel 10

## Run the project

To run this project, firstly make sure you have php & composer installed. You can download it from the official website listed below, or you can use a service like Chocolatey for Windows, HomeBrew for MacOS, or pip for Linux.

After you have successfully installed both Php and Composer, run this in the backend folder of the project:

Create a .env file in your backend folder using the .env-example template. Go through the .env-example file and configure some of the attributes. (Some require api keys for the app to function)

```bash
  cd backend
  composer install
  npm install
```

Make sure you have MySQL database installed, and once it is up and running, run this in the same folder:

```bash
  php artisan migrate

```

Then head to the frontend folder in the project and run:

```bash
  cd frontend
  npm install

```

Since the application sends emails for Notifications, you need to setup a mailing service, i.e. give it an api key in the .env file (Recommended: MailTrap.io).

After successfully doing those installations, run the backend with:

```bash
  cd backend
  php artisan serve
  npm run dev
```

Run the frontend with:

```bash
  cd frontend
  npm start
```
## Acknowledgements

 - [PHP](https://www.php.net/)
 - [Composer](https://getcomposer.org/)
 - [Laravel](https://laravel.com/)
 - [React](https://react.dev/)
 - [Mui](https://mui.com/)
 - [MailTrap](https://mailtrap.io/)
 - [MySQL](https://www.mysql.com/)
 - [Chocolatey](https://chocolatey.org/)
 - [HomeBrew](https://brew.sh/)
