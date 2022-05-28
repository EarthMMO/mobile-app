import * as SecureStore from "expo-secure-store";
import { Buffer } from "buffer";
import { ethers } from "ethers";

import { BACKEND_API_URL } from "config";

const path = `m/44'/60'/0'/0/1`;

export const createOrImportWallet = async (importedMnemonics = "") => {
  try {
    let wallet;
    if (importedMnemonics === "") {
      wallet = ethers.Wallet.createRandom({ path });
    } else {
      wallet = ethers.Wallet.fromMnemonic(importedMnemonics, path);
    }

    const mnemonics = wallet.mnemonic.phrase;
    const privateKey = wallet.privateKey;
    const ethereumAddress = wallet.address;

    console.log("WALLET", {
      mnemonic: wallet.mnemonic.phrase,
      privateKey: wallet.privateKey,
      ethereumAddress: wallet.address,
    });

    const signature = await wallet.signMessage(Buffer.from("hello"));

    const response = await apiRequest("v0/user", "POST", false, {
      ethereumAddress,
      signature,
    });

    console.log("RESPONSE", response);

    await SecureStore.setItemAsync(
      "wallet",
      JSON.stringify({
        ethereumAddress,
        jwt: response.jwt,
        mnemonics,
        privateKey,
        userId: response.userId,
      })
    );

    return {
      ethereumAddress,
      isSignedIn: true,
      userId: response.userId,
    };
  } catch (error) {
    console.log(error);
  }
};

async function renewJwt() {
  const walletString = await SecureStore.getItemAsync("wallet");
  const wallet = JSON.parse(walletString);

  const ethereumAddress = wallet.ethereumAddress;
  const mnemonics = wallet.mnemonics;
  const privateKey = wallet.privateKey;
  const userId = wallet.userId;

  const ethersWallet = ethers.Wallet.fromMnemonic(mnemonics, path);
  const signature = await ethersWallet.signMessage(Buffer.from("hello"));

  const response = await apiRequest("v0/user", "POST", false, {
    ethereumAddress,
    signature,
  });

  const newJwt = response.jwt;

  await SecureStore.setItemAsync(
    "wallet",
    JSON.stringify({
      ethereumAddress,
      jwt: newJwt,
      mnemonics,
      privateKey,
      userId,
    })
  );

  return newJwt;
}

export async function apiRequest(path, method = "GET", jwtNeeded = true, data) {
  let jwt = "Bearer accessToken";
  if (jwtNeeded) {
    const walletString = await SecureStore.getItemAsync("wallet");
    const wallet = JSON.parse(walletString);
    jwt = wallet.jwt;
  }

  let response;
  try {
    response = await fetch(`${BACKEND_API_URL}/api/${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: jwt,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    if (response.status === 401) {
      await renewJwt();
      return await apiRequest(path, method, data);
    }
  }
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
