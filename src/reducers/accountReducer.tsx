
// @ts-nocheck 
export type AccountState = {
  isLoading: boolean
  account: {
    address: string
    secret?: string
  } | null
  nfts: object[]
}

const initialState: AccountState = {
  isLoading: false,
  account: null,
  nfts: [{}]
}

export enum AccountActionTypes {
  SET_ACCOUNT = "SET_ACCOUNT",
  SET_IS_ACCOUNT_LOADING = "SET_IS_ACCOUNT_LOADING",
  SET_ACCOUNT_NFTS = "SET_ACCOUNT_NFTS"
}

export type AccountAction =
  | {
      type: AccountActionTypes.SET_ACCOUNT

      payload: {
        address: string
        secret?: string
      } | null
    }
  | { type: AccountActionTypes.SET_IS_ACCOUNT_LOADING; payload: boolean }
  | { type: AccountActionTypes.SET_ACCOUNT_NFTS; payload: object[] }

const reducer = (state: AccountState, action: AccountAction): AccountState => {
  switch (action.type) {
    case AccountActionTypes.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      }
    case AccountActionTypes.SET_IS_ACCOUNT_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case AccountActionTypes.SET_ACCOUNT_NFTS:
      return {
        ...state,
        nfts: action.payload
      }
    default:
      return state
  }
}

export { initialState, reducer }
