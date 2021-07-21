import Payment from "../../models/Payment";

import { SET_PAYMENTS,CREATE_PAYMENT,SETTLE_PAYMENT,DELETE_PAYMENT } from "../actions/payments";

const initialState = {
    groupPayments:[]
}

export default function(state = initialState,action){
    switch(action.type){
        case SET_PAYMENTS:{
            return {
                groupPayments:action.groupPayments
            }
        }
        case CREATE_PAYMENT:{
            const newPayment = new Payment(
                action.paymentData.id,
                action.paymentData.groupId,
                action.paymentData.amount,
                action.paymentData.payerId,
                action.paymentData.payerName,
                action.paymentData.burrowerId,
                action.paymentData.burrowerName,
                action.paymentData.expenseTitle,
                action.paymentData.isSettled
            )
            return {
                ...state,
                groupPayments:state.groupPayments.concat(newPayment)
            }
        }
        case SETTLE_PAYMENT:{
            const existingPayments = state.groupPayments.filter(payment => payment.id !== action.paymentData.id);
            const updatedPayment = new Payment(
                action.paymentData.id,
                action.paymentData.groupId,
                action.paymentData.amount,
                action.paymentData.payerId,
                action.paymentData.payerName,
                action.paymentData.burrowerId,
                action.paymentData.burrowerName,
                action.paymentData.expenseTitle,
                action.paymentData.isSettled
            )
            existingPayments.push(updatedPayment);
            return {
                ...state,
                payments:existingPayments
            }
        }
        case DELETE_PAYMENT:{
            return {
                ...state,
                groupPayments:state.groupPayments.filter(payment => payment.id !== action.paymentId)
            }
        }
        default: return state;
    }
}