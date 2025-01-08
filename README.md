# React Router Netlify Template

A modern, mvp-ready template for building full-stack React applications using React Router,
deployed to Netlify.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 Firebase Authentication with Google Sign-in
- 🗄️ Firestore database integration
- 📖 [React Router docs](https://reactrouter.com/)
- 💻 Configured for deployment to Netlify

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Google" provider
   - Add authorized domains for your application

3. Set up Firestore:
   - Go to Firestore Database
   - Create database (start in test mode)
   - Set up your security rules

4. Get your Firebase configuration:
   - Click on the Project Overview
   - Add a web app and copy the config object to the firebase-config.example.ts file (then rename it to firebase-config.ts)
   - Go to Project Settings > General
   - Click on the service accounts tab
   - Generate a new private key for Node.js and download the JSON file locally (keep it secure and do not add it to this repo)
   - Copy the private key info to the .env file make sure to wrap the private key in quotes

5. Set up required environment variables:
   Create a `.env` file in the root directory:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   SESSION_SECRET=your-session-secret
   ```

   Get these values from:
   - Project Settings > Service accounts > Generate new private key
   - Generate a secure random string for SESSION_SECRET

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Authentication Flow

This template implements a secure authentication flow using:
- Firebase Authentication for Google Sign-in
- Server-side session management
- Protected routes with authentication checks
- XSS protection through server-side sanitization

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

This template is configured for deployment to Netlify.

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Add your environment variables in Netlify's dashboard
4. Deploy!

See <https://docs.netlify.com/welcome/add-new-site/> to add this project as a site
in your Netlify account.

Manual Deployment:

```bash
netlify deploy --build --prod
```

Set up as a new site in Netlify
Follow the prompts to set up your site.
When done building you'll need to follow the link to your new site.
Now set up the environment variables in Netlify's dashboard.
Now you can redeploy your site to Netlify
Make sure to add the netlify domain to your firebase project in the authentication settings.
This allows the app to authenticate with firebase.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
