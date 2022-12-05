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
          text={wallet.secret}
          onCopy={() => {
            message.open({
              type: "info",
              content: "Copied to clipboard",
            })
          }}
        >
          <span style={{ color: "#40a9ff", cursor: "pointer" }}>
            {wallet.secret}
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
        console.log(JSON.stringify(response, null, 2))

        const payload = {
          address: response.result.account_data.Account,
          balance: Number(response.result.account_data.Balance) / 1000000,
          classicAddress: classicAddress,
          secret: seed || secret,
        }

        dispatch({ type: AccountActionTypes.SET_ACCOUNT, payload })
        dispatch({
          type: AccountActionTypes.SET_IS_ACCOUNT_LOADING,
          payload: false,
        })
  
        response = await client.request({
          command: "account_nfts",
          account: address,
          ledger_index: "validated",
        })
        // minting transactions

        const mintTransactionBlob = {
          "TransactionType": "NFTokenMint",
          "Account": classicAddress,
          "URI": xrpl.convertStringToHex("https://gateway.pinata.cloud/ipfs/QmbQQDdRATZ12xmTssaQkH7qWNkN8Unfdw818wAXpeRGZX"),
          "Flags": 8,
          "TransferFee": 0,
          "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
        }
       const signedTx = await wallet.sign(mintTransactionBlob)
       console.log("The transaction was signed " + signedTx + " address => " )
       const tx = await client.submitAndWait(mintTransactionBlob, { wallet: wallet } )

        // response = await client.request({
        //   command: "account_nfts",
        //   account: address,
        //   ledger_index: "validated",
        // })
        console.table( tx )
        
        response = await client.request({
          command: "account_nfts",
          account: address,
          ledger_index: "validated",
        })
        console.log(" NFTs => " , response )
        let account_nfts = response.result.account_nfts
        console.log("Account NFTs => " , account_nfts )
        dispatch({
          type: AccountActionTypes.SET_ACCOUNT_NFTS,
          payload: account_nfts
        });

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
