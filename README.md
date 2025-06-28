# Snipdox

> **Warning**: This is by no means a professional or company-ready project, it’s purely a hobby project. The code
> quality is quite rough in many places, so please be gentle!
> Pull requests are very welcome 😉.

Snipdox is a clean, modern code sharing platform built with Nuxt (Vue) and PostgreSQL. It allows users to share code
snippets easily and optionally include error titles and details alongside the shared code.

---

## Features

- User authentication and session management
- Create, read and delete code snippets. (Maybe updating code snippets in the future)
- Support for private and public pastes (Work in Progress)
- Code snippet expiration management
- Syntax highlighting for various programming languages
- Basic search and pagination
- Clean and modern UI design using Vue and Nuxt

---

## Tech Stack

- **Frontend**: Nuxt 3 / Vue 3
- **Backend**: Node.js server endpoints (via Nuxt server engine)
- **Database**: PostgreSQL
- **Authentication**: GitHub OAuth

---

## Contributing

This project is a hobby and learning playground. If you find bugs or want to improve the code, please submit pull
requests, contributions are very welcome 😉. Just keep in mind the codebase is a bit messy and not production hardened.

---

## Installation

1. Clone the stuff, use `npm install` or `pnpm install` or what you prefer.
2. Rename `.env.example` to `.env` and fill in the required environment variables.
3. Change everything from the `/public/legal/` directory to your own legal documents, or remove them if you don't need
   them.
    - The files in this directory are placeholders and should not be used as-is.
4. Create the database tables, all commands are listed in the `database.sql` file in the root directory.

---

## Important Notice on Legal Documents

If you deploy this project yourself or use it for your own purposes, **you MUST remove or replace all data in
the `/public/legal/` directory (Imprint, Privacy Policy, etc.) before making the site public.**  
The provided legal files contain placeholder information only and are not intended for use by third parties. Proper
legal compliance and liability are your responsibility.

---

## Credits

- [FontAwesome](https://fontawesome.com/) for icons
- [CodeMirror](https://codemirror.net/) for code syntax highlighting
- [Google Fonts](https://fonts.google.com/) for typography

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.