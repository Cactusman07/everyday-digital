# Every Day Digital — WordPress React Theme

A custom WordPress theme for [Every Day Digital](https://everydaydigital.co.nz), built with React, TypeScript, GraphQL, and Tailwind CSS, served via Docker.

Based on the tutorial at [sammuir.co.nz](https://sammuir.co.nz/blog/wordpress-react-tutorial/).

---

## Prerequisites

Make sure the following are installed before getting started:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (included with Node.js)

---

## Local URLs

| Service      | URL                          |
|--------------|------------------------------|
| WordPress    | http://localhost:8181        |
| BrowserSync  | http://localhost:3000        |
| phpMyAdmin   | http://localhost:8180        |
| MariaDB      | localhost:3306               |

> During development, use **localhost:3000** (BrowserSync) rather than localhost:8181 directly — it provides live reloading on file changes.

---

## First-Time Setup

Follow these steps once when setting up the project for the first time.

### 1. Install dependencies

```bash
npm install
```

### 2. Start Docker containers

```bash
docker-compose up -d
```

This creates a `wordpress/` directory alongside `docker-compose.yml` where the WordPress files will be stored.

### 3. Fix Docker file permissions

This step is required due to how the WordPress Docker image handles file ownership.

Find the WordPress container ID:

```bash
docker ps
```

Open a shell inside the container:

```bash
docker exec -it <container_id> /bin/bash
```

Then run:

```bash
chown -R root:root /var/www/html
exit
```

### 4. Complete the WordPress installation

Navigate to **http://localhost:8181** and follow the WordPress setup wizard to create your site and admin account.

### 5. Install the WPGraphQL plugin

The theme requires the [WPGraphQL plugin](https://www.wpgraphql.com/) to serve content to the React frontend.

1. Log in to the WordPress admin at **http://localhost:8181/wp-admin**
2. Go to **Plugins → Add New**
3. Search for **WPGraphQL** and install it
4. Activate the plugin

### 6. Build the frontend assets

Run the following two commands in separate terminal windows so both run concurrently:

**Terminal 1 — Webpack (JS + BrowserSync):**
```bash
npm run build-dev
```

**Terminal 2 — Tailwind CSS:**
```bash
npm run watch-css
```

Open **http://localhost:3000** in your browser. The page will automatically reload when you change any `.php`, `.ts`, or `.tsx` file.

---

## Daily Development

Once the first-time setup is done, start the environment each day with:

```bash
docker-compose up -d
```

Then run the two watch processes in separate terminals:

```bash
npm run build-dev    # Terminal 1
npm run watch-css    # Terminal 2
```

Or use the combined start script (opens the browser and runs the build pipeline):

```bash
npm start
```

---

## Stopping & Removing Containers

Stop containers (preserves data):

```bash
npm run stop
```

Remove containers (preserves the `wordpress/` data volume):

```bash
npm run remove
```

To also remove the database volume entirely:

```bash
docker-compose down -v
```

---

## Available Scripts

| Script              | Description                                              |
|---------------------|----------------------------------------------------------|
| `npm start`         | Start Docker, open browser, build CSS, start webpack watch |
| `npm run build-dev` | Webpack watch mode (JS + BrowserSync dev server)         |
| `npm run build-prod`| Production webpack build (outputs to `./dist`)           |
| `npm run build-css` | One-time Tailwind CSS build                              |
| `npm run watch-css` | Tailwind CSS watch mode                                  |
| `npm run stop`      | Stop all Docker containers                               |
| `npm run remove`    | Remove all Docker containers                             |
| `npm test`          | Run TypeScript type check and Jest tests                 |

---

## Project Structure

```
everyday-digital/
├── src/                   # React + TypeScript source
│   ├── components/        # UI components
│   ├── hooks/             # Custom hooks and GraphQL queries
│   └── index.tsx          # App entry point
├── wpTheme/               # WordPress theme files (mounted into Docker)
│   ├── dist/              # Compiled JS and CSS (webpack/Tailwind output)
│   ├── scripts/           # WordPress-side JavaScript
│   └── functions.php      # Theme setup and custom post types
├── wordpress/             # WordPress install (created by Docker, git-ignored)
├── docker-compose.yml
└── webpack.config.js
```
