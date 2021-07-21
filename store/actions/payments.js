import Payment from '../../models/Payment';
import { fetchGroups } from './groups';
export const CREATE_PAYMENT = 'CREATE_PAYMENT';
export const SET_PAYMENTS = 'SET_PAYMENTS';
export const SETTLE_PAYMENT = 'SETTLE_PAYMENT';
export const DELETE_PAYMENT = 'DELETE_PAYMENT';
export const fetchPayments = () => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const groupId = getState().group.groupId;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/payments.json`,
            {
                method:'GET',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                }
            }
        );
        if(!response.ok){
            throw new Error('Something went wrong!!');
        }
        const resData = await response.json();
        const loadedPayments = [];
        for(const key in resData){
            loadedPayments.push(
                new Payment(
                    key,
                    resData[key].groupId,
                    resData[key].amount,
                    resData[key].payerId,
                    resData[key].payerName,
                    resData[key].burrowerId,
                    resData[key].burrowerName,
                    resData[key].expenseTitle,
                    resData[key].isSettled
                )
            );
        };
        await dispatch({type:SET_PAYMENTS,groupPayments:loadedPayments.filter(payment => payment.groupId === groupId)});
    }
}

export const addPayment = (amount,payerId,payerName,burrowerId,burrowerName,expenseTitle) => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const groupId = getState().group.groupId;
        const isSettled = false;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/payments.json`,
            {
                method:'POST',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    groupId:groupId,
                    amount:amount,
                    payerId:payerId,
                    payerName:payerName,
                    burrowerId:burrowerId,
                    burrowerName:burrowerName,
                    expenseTitle:expenseTitle,
                    isSettled:isSettled
                })
            }
        );
        if(!response.ok){
            throw new Error('Something went wrong!!');
        }
        const resData = await response.json();
        await dispatch({
            type:CREATE_PAYMENT,
            paymentData:{
                id:resData.name,
                groupId,
                amount,
                payerId,
                payerName,
                burrowerId,
                burrowerName,
                expenseTitle,
                isSettled
            }
        });     
    }
}

export const settlePayment = (paymentId,amount,payerId,payerName,burrowerId,burrowerName,expenseTitle,isSettled) => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const groupId = getState().group.groupId;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/payments/${paymentId}.json`,
            {
                method:'PUT',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    id:paymentId,
                    groupId:groupId,
                    amount:amount,
                    payerId:payerId,
                    payerName:payerName,
                    burrowerId:burrowerId,
                    burrowerName:burrowerName,
                    expenseTitle:expenseTitle,
                    isSettled:isSettled
                })
            }
        );
        if(!response.ok){
            throw new Error("Something went wrong!!");
        }
        const resData = await response.json();
        await dispatch({
            type:SETTLE_PAYMENT,
            paymentData:{
                id:paymentId,
                groupId,
                amount,
                payerId,
                payerName,
                burrowerId,
                burrowerName,
                expenseTitle,
                isSettled
            }
        });  
    }
}

export const deletePayment = paymentId => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
      const response = await fetch(
        `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/payments/${paymentId}.json`,
        {
          method: 'DELETE'
        }
      );
  
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      await dispatch({ type: DELETE_PAYMENT, paymentId: paymentId });
    };
  };