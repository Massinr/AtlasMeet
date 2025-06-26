# AtlasMeet

A modern, secure, and feature-rich event management and account approval platform for educational communities, with Discord integration for admin workflows.

## Features
- **Account Approval System:** New accounts require admin approval via Discord bot with approve/deny buttons.
- **Discord Integration:** Real-time notifications and admin actions via Discord webhooks and bot.
- **Role-based Dashboards:** Separate dashboards for students and teachers.
- **Event Management:** Create, edit, and manage events with categories, capacity, deadlines, and virtual/in-person support.
- **Profile Management:** Upload profile pictures, update settings, and manage notifications.
- **Dark/Light Mode:** User-selectable theme with system preference detection and persistence.
- **Modern UI:** Responsive, glassmorphic design with smooth transitions.
- **Security:** No hardcoded secrets; all sensitive data is managed via environment variables.

## Tech Stack
- **Frontend:** React, TypeScript, CSS Modules
- **Icons:** Lucide React
- **Discord Integration:** Discord Webhooks & Bot API

## Installation

```bash
# Clone the repository
$ git clone https://github.com/yourusername/atlasmeet.git
$ cd atlasmeet/atlasmeet

# Install dependencies
$ npm install
# or
yarn install
```

## Configuration
1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```
2. Fill in your Discord webhook, bot token, and channel/server IDs in `.env`.

## Running the App

### Development
```bash
npm start
# or
yarn start
```

### Production Build
```bash
npm run build
# or
yarn build
```

## Deployment
- **Static Hosting:** The app can be deployed to GitHub Pages, Vercel, Netlify, or any static host.
- **GitHub Pages:**
  1. Add the following to your `package.json`:
     ```json
     "homepage": "https://yourusername.github.io/atlasmeet"
     ```
  2. Deploy using:
     ```bash
     npm run build
     npm install -g gh-pages
     gh-pages -d build
     ```

## Screenshots
> _Add screenshots here_
- ![Dashboard Screenshot](screenshots/dashboard.png)
- ![Event Form Screenshot](screenshots/event-form.png)
- ![Discord Approval Screenshot](screenshots/discord-approval.png)

## License
[MIT License](LICENSE)

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Contact
For support, open an issue or contact the maintainer at [your-email@example.com].
