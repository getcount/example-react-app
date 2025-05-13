# COUNT Partner Server

This server provides backend functionality for integrating with COUNT's Partner API. It is responsible for securely communicating with COUNT, performing authenticated operations, and managing business logic such as bill creation, vendor sync, and chart of account associations.

## 📦 Scripts

| Script        | Description                                      |
| ------------- | ------------------------------------------------ |
| `start`       | Starts the compiled server                       |
| `start:dev`   | Starts the server with live reload (development) |
| `build`       | Compiles the server using your build tool        |
| `build:start` | Builds the project and then starts it            |

Run any script using:

```bash
npm run <script-name>
```

For example:

```bash
npm run start:dev
```

---

## ⚠️ Important Notes

### 🔐 All Requests Must Be Signed

To ensure authenticity and security, **every request** sent from your backend to COUNT’s Partner API **must be signed** using your `clientSecret`.

This prevents:

- Tampering
- Replay attacks
- Unauthorized access

### ✍️ Signature Requirements

Each request to COUNT’s API must include the following headers:

| Header        | Description                                            |
| ------------- | ------------------------------------------------------ |
| `x-client-id` | Your unique client identifier from the COUNT dashboard |
| `x-timestamp` | Current UNIX timestamp in seconds                      |
| `x-signature` | HMAC-SHA256 signature of the request                   |

The signature is generated using:

- HTTP method (`GET`, `POST`, etc.)
- The request path (excluding domain)
- Current timestamp
- Hashed request body (for `POST`, `PUT`, or `PATCH`)

---

## ✅ Recommended Axios Setup for Request Signing

```js
const axios = require("axios");
const crypto = require("crypto");

// Create an Axios instance with COUNT API base URL
const countClient = axios.create({
  baseURL: process.env.COUNT_PARTNER_API_ENDPOINT,
  headers: {
    "x-client-id": process.env.COUNT_CLIENT_ID,
  },
});

// Attach interceptor to sign every outgoing request
countClient.interceptors.request.use(signRequest, (error) =>
  Promise.reject(error)
);

// Request signing logic
function signRequest(config) {
  const method = (config.method || "GET").toUpperCase();
  const url = config.url || "/";
  const urlPath = new URL(url, config.baseURL).pathname;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const clientSecret = process.env.COUNT_CLIENT_SECRET;
  const body = config.data || {};

  const signature = generateSignature({
    method,
    path: urlPath,
    timestamp,
    body,
    clientSecret,
  });

  config.headers["x-timestamp"] = timestamp;
  config.headers["x-signature"] = signature;

  return config;
}

// Create SHA-256 hash of request body
function hashBody(body) {
  return body && Object.keys(body).length > 0
    ? crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex")
    : "";
}

// Build the base string used for HMAC signing
function buildHmacBaseString(method, path, timestamp, bodyHash = "") {
  return `${method}:${path}:${timestamp}:${bodyHash}`;
}

// Generate HMAC-SHA256 signature
function generateSignature({ method, path, timestamp, body, clientSecret }) {
  const bodyHash = ["POST", "PUT", "PATCH"].includes(method)
    ? hashBody(body)
    : "";

  const baseString = buildHmacBaseString(method, path, timestamp, bodyHash);

  return crypto
    .createHmac("sha256", clientSecret)
    .update(baseString)
    .digest("hex");
}
```

---

For more details, visit the COUNT Partner API documentation or reach out to our support team.
