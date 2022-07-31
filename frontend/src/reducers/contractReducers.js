import { CONTRACT_DETAILS_FAIL, CONTRACT_DETAILS_REQUEST, CONTRACT_DETAILS_RESET, CONTRACT_DETAILS_SUCCESS } from "../constants/contractConstants"

export const contractDetailsReducer = (state = {}, action) => {
    switch (action.type) {
      case CONTRACT_DETAILS_REQUEST:
        return { loading: true }
      case CONTRACT_DETAILS_SUCCESS:{
        return { loading: false, nft: action.payload.nft,marketplace:action.payload.marketplace,account:action.payload.account }}
      case CONTRACT_DETAILS_FAIL:
        return { loading: false, error: action.payload }
      case CONTRACT_DETAILS_RESET:
        return {  }
      default:
        return state
    }
  }
