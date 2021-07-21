import Expense from "../../models/Expense";

import { SET_EXPENSES,CREATE_EXPENSE,DELETE_EXPENSE } from "../actions/expenses";

const initialState = {
    groupExpenses:[],
}

export default function(state = initialState,action){
    switch(action.type){
        case SET_EXPENSES:{
            return {
                ...state,
                groupExpenses:action.groupExpenses
            }
        }
        case CREATE_EXPENSE:{
            const newExpense = new Expense(
                action.expenseData.id,
                action.expenseData.groupId,
                action.expenseData.title,
                action.expenseData.amount,
                action.expenseData.paidBy,
                action.expenseData.paidTo,
                action.expenseData.date
            )
            return {
                ...state,
                groupExpenses:state.groupExpenses.concat(newExpense)
            }
        }
        case DELETE_EXPENSE:{
            return {
                ...state,
                groupExpenses:state.groupExpenses.filter(expense => expense.id !== action.expenseId)
            }
        }
        default: return state;
    }
}