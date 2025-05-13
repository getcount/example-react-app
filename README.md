# Example React App — Detailed Documentation

## 📘 Project Overview and Purpose

This project is a React-Express-based full stack application designed to integrate with COUNT via OAuth. It demonstrates a secure connection flow, a structured component layout, and interactions with backend APIs to manage financial data such as transactions, bills, and chart of accounts.

---

## ⚙️ Setup Instructions and Environment Variables

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd client
   ```

2. **Install dependencies**:

   ```bash
   npm run install:all
   ```

3. **Create a `.env` file** in the root of the `client` and `server' directories with the following:

- Client
  ```
  REACT_APP_BASE_URL_API=<Your backend API base URL>
  REACT_APP_COUNT_CLIENT_ID=<Your OAuth client ID for COUNT>
  ```
- Server
  ```
  NODE_ENV=development
  COUNT_CLIENT_ID=<Your Client ID>
  COUNT_CLIENT_SECRET=<Your Client Secret>
  COUNT_PARTNER_API_ENDPOINT=<COUNT Partners API Endpoint>
  ```

4. **Start the development server**:

   ```bash
   npm run start:dev
   ```

---

## 🧭 Main App Structure and Routing

### `/client`

- All client side code examples

### `/server`

- All server side code examples
