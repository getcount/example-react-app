import { NextFunction, Request, Response } from "express";
import axios from "axios";

interface CountConnection {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  workspaceId: string;
  workspaceName: string;
}
const countConnections: CountConnection[] = [];

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
    const exchangeEndpoint = `${process.env.COUNT_PARTNER_API_ENDPOINT}/grant-access-token`;

    const { data } = await axios.post(exchangeEndpoint, exchangeAuthCodeOpts, {
      headers: {
        "x-client-secret": process.env.COUNT_CLIENT_SECRET as string,
        "x-client-id": process.env.COUNT_CLIENT_ID as string,
      },
    });

    // push data
    countConnections.push(data.data.result);

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

export const chartOfAccounts = async function (req: Request, res: Response) {
  try {
    // Identify your team uuid
    const accessToken = countConnections.filter(
      (_con) => _con.workspaceId === req.query.workspaceId
    )[0]?.accessToken;

    const chartOfAccountsEndpoint = `${process.env.COUNT_PARTNER_API_ENDPOINT}/chart-of-accounts`;
    const { data } = await axios.get(chartOfAccountsEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-client-secret": process.env.COUNT_CLIENT_SECRET as string,
        "x-client-id": process.env.COUNT_CLIENT_ID as string,
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

    const chartOfAccountsEndpoint = `${process.env.COUNT_PARTNER_API_ENDPOINT}/transactions`;
    const { data } = await axios.post(chartOfAccountsEndpoint, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-client-secret": process.env.COUNT_CLIENT_SECRET as string,
        "x-client-id": process.env.COUNT_CLIENT_ID as string,
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
