import { OAuth } from "@raycast/api";
const clientId = "2dd7c1e4-824f-49ac-8587-2cd9f93c8893";
const tenantId = "common";
import axios, { AxiosError } from "axios";

const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Microsoft",
  providerIcon: "mmicrosoft-logo.ico",
  description: "Connect your Microsoft account...",
});

export async function authorize(): Promise<string> {
  const tokenSet = await client.getTokens();
  console.log(`tokenSet: ${JSON.stringify(tokenSet)}`);
  if (tokenSet?.accessToken) {
    if (tokenSet.refreshToken && tokenSet.isExpired()) {
      const tokenResp = await refreshTokens(tokenSet.refreshToken);
      await client.setTokens(tokenResp);
    }
    return tokenSet.accessToken;
  }
  console.log("No access token, requesting authorization...");
  const authRequest = await client.authorizationRequest({
    scope: "offline_access openid profile Tasks.ReadWrite User.Read",
    clientId: clientId,
    endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
    extraParameters: { redirect_uri: "https://raycast.com/redirect/extension" },
  });
  console.log("authRequest: " + JSON.stringify(authRequest));
  const { authorizationCode } = await client.authorize(authRequest);
  console.log(`authorizationCode: ${authorizationCode}`);
  let tokenResp = await fetchTokens(authorizationCode, authRequest);
  client.setTokens(tokenResp);
  return tokenResp.access_token;
}

async function fetchTokens(authCode: string, authRequest: OAuth.AuthorizationRequest): Promise<OAuth.TokenResponse> {
  console.log("fetchTokens");
  const reqData = new URLSearchParams();
  reqData.append("client_id", clientId);
  reqData.append("scope", "offline_access openid profile Tasks.ReadWrite User.Read");
  reqData.append("code", authCode);
  reqData.append("redirect_uri", "https://raycast.com/redirect/extension");
  reqData.append("grant_type", "authorization_code");
  reqData.append("code_verifier", authRequest.codeVerifier);
  const requestUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  try {
    const { data } = await axios.post(requestUrl, reqData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data;
  } catch (error) {
    let err = error as AxiosError;
    console.log(err.response?.data);
    throw error;
  }
}

async function refreshTokens(refreshToken: string): Promise<OAuth.TokenResponse> {
  const reqData = new URLSearchParams();
  reqData.append("client_id", clientId);
  reqData.append("scope", "offline_access openid profile Tasks.ReadWrite User.Read");
  reqData.append("refresh_token", refreshToken);
  reqData.append("grant_type", "refresh_token");
  reqData.append("redirect_uri", "https://raycast.com/redirect/extension");

  const requestUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const { data } = await axios.post<OAuth.TokenResponse>(requestUrl, reqData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return data;
}
