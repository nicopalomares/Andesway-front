# Andes Way - Rent a Car

Responsive website for promoting and managing a rental vehicle fleet in Mendoza, Argentina. It includes a public catalog, vehicle details, availability calendar, WhatsApp inquiries, and a Supabase-protected administration panel.

## Features

- Catalog of available vehicles.
- Vehicle detail page with image gallery and specifications.
- Availability calendar for each vehicle.
- Reservation inquiries through WhatsApp.
- Corporate, feature, and testimonial sections.
- Administrator sign-in.
- Vehicle creation, editing, and status management.
- Image management through URLs or Supabase Storage uploads.
- Management of unavailable date ranges.
- Responsive navigation and layouts for mobile and desktop.

## Technologies

- React 19
- TypeScript
- Vite 6
- React Router 7
- Tailwind CSS 4
- Supabase Auth, Database, and Storage
- Motion
- date-fns
- Lucide React

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Supabase project
- Supabase Auth account for administration access

## Installation

```bash
npm install
```

Copy the example environment file and complete the local variables:

```bash
cp .env.example .env
```

Available variables:

```dotenv
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"
```

> Never use a `service_role` key in the frontend. Use only the public `anon` key and protect operations with Row Level Security.

## Run in Development

```bash
npm run dev
```

The application will be available at:

- `http://localhost:3000`
- The local-network address shown by Vite

## Available Scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Starts the Vite development server      |
| `npm run build`   | Creates the production build in `dist/` |
| `npm run preview` | Previews the production build           |
| `npm run lint`    | Runs the TypeScript validation          |
| `npm run clean`   | Removes the `dist/` directory           |

## Supabase Configuration

The client is initialized in `src/services/supabase.ts`.

### Required Tables

```text
cars
car_images
car_unavailability
```

### `cars` Table

| Column              | Expected Type | Description                                  |
| ------------------- | ------------- | -------------------------------------------- |
| `id`                | UUID          | Vehicle identifier                           |
| `title`             | text          | Display name                                 |
| `year`              | integer       | Model year                                   |
| `category`          | text          | `suv`, `offroad`, `sedan`, or `economy`      |
| `price_per_day`     | numeric       | Daily rental price                           |
| `preview_image_url` | text          | Main image                                   |
| `transmission`      | text          | `automatic` or `manual`                      |
| `passengers`        | integer       | Passenger capacity                           |
| `status`            | text          | `available`, `unavailable`, or `maintenance` |
| `description`       | text          | Optional description                         |
| `created_at`        | timestamptz   | Creation date                                |

### `car_images` Table

| Column          | Expected Type | Description           |
| --------------- | ------------- | --------------------- |
| `id`            | UUID          | Image identifier      |
| `car_id`        | UUID, FK      | Associated vehicle    |
| `image_url`     | text          | Public image URL      |
| `display_order` | integer       | Gallery display order |

### `car_unavailability` Table

| Column       | Expected Type | Description           |
| ------------ | ------------- | --------------------- |
| `id`         | UUID          | Date-range identifier |
| `car_id`     | UUID, FK      | Associated vehicle    |
| `start_date` | date          | First unavailable day |
| `end_date`   | date          | Last unavailable day  |
| `reason`     | text          | Optional reason       |

### Storage

The administration panel expects a public bucket named:

```text
car-images
```

Images are stored under paths formatted as:

```text
car-images/<car_id>/<file-name>
```

## Security and Permissions

Configure RLS policies so that:

- Visitors can read available vehicles and public information.
- Only authenticated users can manage vehicles and images.
- Only authenticated users can create or delete unavailable date ranges.
- The bucket allows public reads if images must be displayed without authentication.
- Uploads and deletions are restricted to authorized administrators.

Administrative access is managed through `/login` using Supabase Auth. The user must already exist in the Supabase project.

## Application Routes

| Route           | Description                   |
| --------------- | ----------------------------- |
| `/`             | Home page and vehicle catalog |
| `/vehiculo/:id` | Vehicle detail page           |
| `/login`        | Administrator sign-in         |
| `/admin`        | Fleet management panel        |

## Project Structure

```text
src/
├── components/     # Visual and reusable components
├── pages/          # Main pages and administration panel
├── services/       # Supabase client and configuration
├── App.tsx         # Route definitions
├── constants.ts    # WhatsApp details, testimonials, and features
├── index.css       # Theme and global styles
├── main.tsx        # Application entry point
└── types.ts        # TypeScript interfaces
```

## Build and Deployment

```bash
npm run build
```

The generated output is placed in `dist/` and can be deployed to Vercel, Netlify, Cloudflare Pages, or another static hosting provider.

For React Router, configure the hosting provider to rewrite all application routes to `index.html`.

General rewrite example:

```text
/vehiculo/*  ->  /index.html
/admin       ->  /index.html
/login       ->  /index.html
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the deployment provider.

## WhatsApp Integration

Inquiries are generated dynamically using the phone number and message text in `src/constants.ts`. When requesting a vehicle, the message includes:

- Vehicle and model.
- Pickup location.
- Selected dates.

## Current Considerations

- Credentials are loaded from Vite environment variables (`VITE_*`).
- When Supabase is not configured, the catalog does not display mock vehicle data.
- Administrative routes require a Supabase client session and must be reinforced with RLS policies.
- The project would benefit from extended error handling and pagination if the fleet grows significantly.

## Development

Before submitting changes:

```bash
npm run lint
npm run build
```
