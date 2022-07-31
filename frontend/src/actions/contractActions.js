import { CONTRACT_DETAILS_FAIL, CONTRACT_DETAILS_REQUEST, CONTRACT_DETAILS_RESET, CONTRACT_DETAILS_SUCCESS } from "../constants/contractConstants"

export const setContracts = (data) => async (dispatch) => {
    console.log(data)
    try {
      dispatch({
        type: CONTRACT_DETAILS_REQUEST,
      })
      dispatch({
        type: CONTRACT_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      dispatch({
        type: CONTRACT_DETAILS_FAIL,
        payload: message,
      })
    }
  }
  
export const removeContracts = () => async (dispatch) => {
    dispatch({type:CONTRACT_DETAILS_RESET})
  }
