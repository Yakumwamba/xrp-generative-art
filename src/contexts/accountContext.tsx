import React, { createContext, useContext, useReducer } from "react"

import { CheckOutlined, SmileOutlined } from "@ant-design/icons"

import { CopyToClipboard } from "react-copy-to-clipboard"

import { notification, message } from "antd"

import { postData } from "utils/http"

import {
  AccountAction,
  AccountActionTypes,
  AccountState,
  initialState,
  reducer,
} from "../reducers/accountReducer"

const xrpl = require("xrpl")

type AccountContextType = [AccountState, React.Dispatch<AccountAction>]

export type Props = {
  children: React.ReactNode
}

//@ts-ignore
const AccountContext = createContext<AccountContextType>(null)

const AccountContextProvider = (props: Props): JSX.Element => {
  const [accountState, accountDispatch] = useReducer(reducer, initialState)

  return (
    <AccountContext.Provider value={[accountState, accountDispatch]}>
      {props.children}
    </AccountContext.Provider>
  )
}

async function connectWallet(
  dispatch: React.Dispatch<AccountAction>,
  seed?: string
) {
  dispatch({ type: AccountActionTypes.SET_IS_ACCOUNT_LOADING, payload: true })

  let client
  let wallet
  try {
    client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect((value: any) => {
      console.log("Connected!", value)
    })
    if (seed) {
      wallet = xrpl.Wallet.fromSeed(seed)
      console.log(wallet)

      notification.open({
        message: `Welcome back `,
        placement: "bottomRight",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      })
    } else {
      wallet = (await client.fundWallet()).wallet
      console.log(wallet)

      const btn = (
        <CopyToClipboard
          text={wallet.seed}
          onCopy={() => {
            message.open({
              type: "info",
              content: "Copied to clipboard",
            })
          }}
        >
          <span style={{ color: "#40a9ff", cursor: "pointer" }}>
            {wallet.seed}
          </span>
        </CopyToClipboard>
      )

      notification.open({
        message: `You generated a new XRP wallet`,
        description: "Save this private seed value to recover later:",
        btn,
        placement: "bottomRight",
        duration: 0,
        icon: <CheckOutlined style={{ color: "#108ee9" }} />,
      })
    }

    const { address, classicAddress, secret } = wallet
    dispatch({ type: AccountActionTypes.SET_WALLET, payload: wallet })
    dispatch({ type: AccountActionTypes.SET_CLIENT, payload: client })

    let response
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        response = await client.request({
          command: "account_info",
          account: address,
          ledger_index: "validated",
        })
        console.log(
          "\n\n----------------Get XRPL NFT Seller's Wallet Account Info----------------"
        )
        // console.log(JSON.stringify(response, null, 2))

        const payload = {
          address: response.result.account_data.Account,
          balance: Number(response.result.account_data.Balance) / 1000000,
          classicAddress: classicAddress,
          secret: seed || secret,
        }

        response = await client.request({
          command: "account_nfts",
          account: address,
          ledger_index: "validated",
        })

        const payloadWithNfts = {
          ...payload,
          nfts: response.result.account_nfts,
        }

        dispatch({
          type: AccountActionTypes.SET_ACCOUNT,
          payload: payloadWithNfts,
        })
        dispatch({
          type: AccountActionTypes.SET_IS_ACCOUNT_LOADING,
          payload: false,
        })

        console.log(response)

        break
      } catch (e) {
        console.error(e)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    client.disconnect()
  } catch (error) {
    console.log(error)
  }
}

const useAccountContext = () => useContext(AccountContext)

export { AccountContextProvider, connectWallet, useAccountContext }
