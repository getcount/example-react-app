import { NextFunction, Request, Response } from "express";
import axios from "axios";
import * as crypto from "crypto";

// setup a reusable client axios instance
const countClient = axios.create({
  baseURL: process.env.COUNT_PARTNER_API_ENDPOINT,
  headers: {
    "x-client-id": process.env.COUNT_CLIENT_ID as string,
  },
});

countClient.interceptors.request.use(
  (config) => {
    const method = (config.method || "GET").toUpperCase();
    const url = config.url ?? "/";
    const urlPath = new URL(url, config.baseURL).pathname;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const clientSecret = process.env.COUNT_CLIENT_SECRET as string;

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
  },
  (error) => Promise.reject(error)
);

/**
 * Hashes the request body using SHA-256 and returns the hexadecimal digest.
 * If the body is empty, returns an empty string.
 *
 * @param body - The request payload to hash.
 * @returns A SHA-256 hash of the stringified body or an empty string.
 */
function hashBody(body: Record<string, any>): string {
  return body && Object.keys(body).length > 0
    ? crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex")
    : "";
}

/**
 * Builds the base string to be signed for HMAC verification.
 *
 * @param method - The HTTP method (GET, POST, etc.)
 * @param path - The request path (e.g., /api/user)
 * @param timestamp - Unix timestamp used to prevent replay attacks.
 * @param bodyHash - Optional SHA-256 hash of the request body.
 * @returns A formatted string to be signed: method:path:timestamp[:bodyHash]
 */
function buildHmacBaseString(
  method: string,
  path: string,
  timestamp: string,
  bodyHash = ""
): string {
  return `${method}:${path}:${timestamp}:${bodyHash}`;
}

/**
 * Parameters used to generate the HMAC signature.
 */
interface GenerateSignatureParams {
  method: string;
  path: string;
  timestamp: string;
  body: Record<string, any>;
  clientSecret: string;
}

/**
 * Generates an HMAC-SHA256 signature using the provided parameters.
 *
 * @param params - An object containing HTTP method, path, timestamp, body, and the client secret.
 * @returns A hexadecimal HMAC signature.
 *
 * @example
 * const signature = generateSignature({
 *   method: 'POST',
 *   path: '/api/user',
 *   timestamp: '1714659912',
 *   body: { name: 'Alice' },
 *   clientSecret: 'supersecretkey'
 * });
 */
function generateSignature(params: GenerateSignatureParams): string {
  const { method, path, timestamp, body, clientSecret } = params;

  const bodyHash = ["POST", "PUT", "PATCH"].includes(method.toUpperCase())
    ? hashBody(body)
    : "";

  const baseString = buildHmacBaseString(method, path, timestamp, bodyHash);

  return crypto
    .createHmac("sha256", clientSecret)
    .update(baseString)
    .digest("hex");
}

interface CountConnection {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  workspaceId: string;
  workspaceName: string;
}
const countConnections: CountConnection[] = [];
const workspaceDetails: { workspaceId: string; workspaceName: string }[] = [];

interface ExchangeAuthCodeOpts {
  code: string;
  grantType: "authorization_code";
}
export const exchagneAccessToken = async function (
  req: Request,
  res: Response
) {
  try {
    // prepare exchagne token params
    const exchangeAuthCodeOpts: ExchangeAuthCodeOpts = {
      grantType: "authorization_code",
      code: req.body.code,
    };

    const { data } = await countClient.post(
      "/grant-access-token",
      exchangeAuthCodeOpts
    );

    // push data
    countConnections.push(data.data.result);
    workspaceDetails.push({
      workspaceName: data.data.result.workspaceName,
      workspaceId: data.data.result.workspaceId,
    });

    // Refresh after two seconds
    // setTimeout(() => {
    //   refreshToken();
    // }, 2000);

    res.status(200).json({
      status: "success",
      message: "Success on exchanging public cod to access code.",
      data: {
        data: {
          workspaceId: data.data.result.workspaceId,
          workspaceName: data.data.result.workspaceName,
        },
      },
    });
  } catch (err: any) {
    console.log(err?.response?.data);
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};

// Refresh access token
async function refreshToken() {
  try {
    // prepare exchagne token params
    const exchangeAuthCodeOpts = {
      grantType: "refresh_token",
      refreshToken: countConnections[0].refreshToken,
    };

    const { data } = await countClient.post(
      "/refresh-user-access-token",
      exchangeAuthCodeOpts
    );

    console.log(data);

    // push data
    countConnections.push(data.data.result);
    workspaceDetails.push({
      workspaceName: data.data.result.workspaceName,
      workspaceId: data.data.result.workspaceId,
    });
  } catch (err: any) {
    console.log(err?.response?.data);
  }
}

export const vendors = async function (req: Request, res: Response) {
  try {
    // Identify your team uuid
    const accessToken = countConnections.filter(
      (_con) => _con.workspaceId === req.query.workspaceId
    )[0]?.accessToken;

    const { data } = await countClient.get("/vendors", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Success on fetching vendors.",
      data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};

export const countWorkspaceDetails = async function (
  req: Request,
  res: Response
) {
  try {
    res.status(200).json({
      status: "success",
      message: "Success on getting on details.",
      data: { workspaceDetails },
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};

export const chartOfAccounts = async function (req: Request, res: Response) {
  try {
    // Identify your team uuid
    const accessToken = countConnections.filter(
      (_con) => _con.workspaceId === req.query.workspaceId
    )[0]?.accessToken;

    const { data } = await countClient.get("/chart-of-accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Success on fetching chart of accounts.",
      data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};

export const createTransaction = async function (req: Request, res: Response) {
  try {
    // Identify your team uuid
    const accessToken = countConnections.filter(
      (_con) => _con.workspaceId === req.query.workspaceId
    )[0]?.accessToken;

    const { data } = await countClient.post("/transactions", req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Success on creating transaction.",
      data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};

export const createBill = async function (req: Request, res: Response) {
  try {
    // Identify your team uuid
    const accessToken = countConnections.filter(
      (_con) => _con.workspaceId === req.query.workspaceId
    )[0]?.accessToken;

    const { data } = await countClient.post("/bills", req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Success on creating bill.",
      data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};
