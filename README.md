# CampusConnect

CampusConnect is a modern campus community platform built with Next.js, Firebase, and Tailwind CSS. It helps students connect, collaborate, and stay updated with campus events, clubs, resources, and more.

---

## Features

- **Home Feed:** See upcoming events and latest announcements.
- **Club Directory:** Browse and filter campus clubs.
- **Event Details:** View event info and register or join.
- **Chat Interface:** Chat with other users and an AI assistant.
- **Resource Library:** Search and filter notes, slides, and recordings.
- **Blog Platform:** Write and share blog posts; view others' blogs.
- **Profile Management:** Edit your profile, bio, and academic info.
- **Issue Reporting:** Submit issues or feedback to the admins.
- **Theme Toggle:** Switch between light and dark mode.

---

## Tech Stack

- **Framework:** [Next.js 13+](https://nextjs.org/)
- **Database:** [Firebase Realtime Database](https://firebase.google.com/docs/database)
- **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI:** Genkit AI flows for friendly chat assistant

---

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/CampusConnect.git
    cd CampusConnect
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure Firebase:**
    - Add your Firebase config to `src/lib/firebase.ts`.
    - Make sure your Firebase project has Realtime Database and Auth enabled.

4. **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `src/app/` — Next.js app routes (pages)
- `src/components/` — Reusable UI components (cards, buttons, forms, etc.)
- `src/lib/` — Utility functions, types, and Firebase config
- `src/ai/` — AI chat flows (Genkit)
- `src/app/globals.css` — Tailwind and custom styles

---

## Style Guide

- **Primary color:** Collegiate blue (`#4F86C6`)
- **Accent color:** Warm yellow-orange (`#FFA500`)
- **Background:** Light off-white (`#F0F4F8`)
- **Font:** [Inter](https://fonts.google.com/specimen/Inter), sans-serif
- **Design:** Minimal, modern, with subtle animations and clear iconography

---

## Contributing

Pull requests are welcome! Please open an issue first for major changes.

---

## License

[MIT](LICENSE)

---

## Credits

- Built with [Next.js](https://nextjs.org/), [Firebase](https://firebase.google.com/), [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI chat powered by [Genkit](https://github.com/genkit-dev/genkit)

---