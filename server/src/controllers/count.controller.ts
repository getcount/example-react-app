import { NextFunction, Request, Response } from "express";
import axios from "axios";

// setup a reusable client axuis ubstabce
const countClient = axios.create({
  baseURL: process.env.COUNT_PARTNER_API_ENDPOINT,
  headers: {
    "x-client-secret": process.env.COUNT_CLIENT_SECRET as string,
    "x-client-id": process.env.COUNT_CLIENT_ID as string,
  },
});

interface CountConnection {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  workspaceId: string;
  workspaceName: string;
}
const countConnections: CountConnection[] = [];
const workspaceDetails: { workspaceId: string; worksapceName: string }[] = [];

interface ExchangeAuthCodeOpts {
  code: string;
  grantType: "authorization_code";
}
export const exchagneAccessToken = async function (
  req: Request,
  res: Response
) {
  try {
    const { body } = req;
    console.log(body);
    // prepare exchagne token params
    const exchangeAuthCodeOpts: ExchangeAuthCodeOpts = {
      grantType: "authorization_code",
      code: body.code,
    };

    const { data } = await countClient.post(
      "/grant-access-token",
      exchangeAuthCodeOpts
    );

    // push data
    countConnections.push(data.data.result);
    workspaceDetails.push({
      worksapceName: data.data.result.worksapceName,
      workspaceId: data.data.result.workspaceId,
    });

    console.log(countConnections);
    res.status(200).json({
      status: "success",
      message: "Success on exchanging public cod to access code.",
    });
  } catch (err: any) {
    console.log(err?.response?.data);
    res
      .status(500)
      .json({ message: err?.response?.data?.message || err.message });
  }
};

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
