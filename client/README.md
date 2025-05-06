# Example React App — Detailed Documentation

## 📘 Project Overview and Purpose

This project is a React-based frontend application designed to integrate with COUNT via OAuth. It demonstrates a secure connection flow, a structured component layout, and interactions with backend APIs to manage financial data such as transactions, bills, and chart of accounts.

---

## ⚙️ Setup Instructions and Environment Variables

1. **Clone the repository** and navigate to the client directory:

   ```bash
   git clone <repo-url>
   cd client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file** in the root of the `client` directory with the following:

   ```
   REACT_APP_BASE_URL_API=<Your backend API base URL>
   REACT_APP_COUNT_CLIENT_ID=<Your OAuth client ID for COUNT>
   ```

4. **Start the development server**:

   ```bash
   npm start
   # or
   yarn start
   ```

---

## 🔐 OAuth Connection Flow

### 🔹 SignIn Page (`src/pages/SignIn/SignIn.jsx`)

- Renders a button to initiate the connection with the COUNT workspace.
- On click:
  - Calls an API to obtain the OAuth authorization URL using `clientId` and `redirectUri`.
  - Stores a random `state` string in `localStorage` to prevent CSRF attacks.
  - Redirects the user to COUNT’s authorization page.

### 🔹 ConnectionSuccess Page (`src/pages/ConnectionSuccess/ConnectionSuccess.jsx`)

- After redirection:
  - Reads the `code` and `state` from URL parameters.
  - Validates the `state` against the stored value.
  - Sends the `authorization code` to the backend to exchange for access tokens.
  - On success, stores the `workspaceId` in `localStorage` and redirects to the main app.
  - Shows a loading spinner and handles errors with toast notifications.

---

## 🧭 Main App Structure and Routing

### `src/App.js`

- Imports global styles.
- Fetches initial connection details on mount.
- Renders the main routing logic.

### Routing (`src/routes/allRoutes.jsx`)

- Defines:
  - Public routes: `/signin`, `/success`
  - Authenticated routes: `/`, `/create-transaction`, `/create-bill`
- Uses React Router’s `<Navigate>` to redirect unknown paths.

---

## 📄 Key Pages Overview

### Chart of Accounts (`src/pages/ChartOfAccounts/ChartOfAccounts.jsx`)

- Fetches data using `workspaceId` from `localStorage`.
- Displays data in a table with:
  - Account number, name, type, subtype, taxes, balance.
- Uses reusable components and tooltips.
- Displays loading spinner during data fetch.

### CreateTransaction / CreateBill

- Example Page to create bill using backend APIs.

### SignIn / ConnectionSuccess

- Handle OAuth sign-in and token exchange process.

---

## 🧩 Components and Utilities

### Reusable Components

- `Tooltip`, `AppLayout`, `Loader`,`Sidebar`, `Dropdowns`, `TextInput`, `Transition`, etc.

### Utilities (`src/utils`)

- Common functions: string manipulation, detecting outside clicks, etc.

### Custom Hooks (`src/hooks`)

- Manage dropdown logic and interactive behavior.

---

## 🚀 How to Run and Test the App

1. Ensure environment variables are properly set.
2. Start the app:

   ```bash
   npm start
   # or
   yarn start
   ```

3. Open the browser at `http://localhost:3000`.
4. Use the **SignIn** page to initiate OAuth.
5. After connection, explore authenticated routes like **Chart of Accounts**.
6. Use browser dev tools and logs for debugging.
7. Watch toast notifications for feedback on API interactions.
