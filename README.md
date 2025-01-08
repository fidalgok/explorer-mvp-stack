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
   - Create database (start in development mode)
   - Set up your security rules

4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" and create a web app
   - Copy the Firebase configuration object

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

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
