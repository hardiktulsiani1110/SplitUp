import Expense from '../../models/Expense';
export const CREATE_EXPENSE = 'CREATE_EXPENSE';
export const SET_EXPENSES = 'SET_EXPENSES';
export const UPDATE_MEMBERS_BALANCES = 'UPDATE_MEMBERS_BALANCES';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';

export const fetchExpenses = () => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const groupId = getState().group.groupId;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/expenses.json`,
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
        const loadedExpenses = [];
        for(const key in resData){
            loadedExpenses.push(
                new Expense(
                    key,
                    resData[key].groupId,
                    resData[key].title,
                    resData[key].amount,
                    resData[key].paidBy,
                    resData[key].paidTo,
                    resData[key].date
                )
            );
        };
        await dispatch({type:SET_EXPENSES,groupExpenses:loadedExpenses.filter(expense => expense.groupId === groupId)});
    }
}

export const addExpense = (title,amount,paidBy,paidTo) => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        const groupId = getState().group.groupId;
        const date = new Date();
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/expenses.json`,
            {
                method:'POST',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    title:title,
                    amount:amount,
                    paidBy:paidBy,
                    paidTo:paidTo, 
                    groupId:groupId,
                    date:date.toISOString()
                })
            }
        );
        if(!response.ok){
            throw new Error('Something went wrong!!');
        }
        const resData = await response.json();
        await dispatch({
            type:CREATE_EXPENSE,
            expenseData:{
                id:resData.name,
                groupId,
                title,
                amount,
                paidBy,
                paidTo,
                date
            }
        });     
    }
}
export const updateMembersBalances = (members) => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const groupId = getState().group.groupId;
        const title = getState().group.groupTitle;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/groups/${groupId}.json`,
            {
                method:'PUT',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    members:members,
                    title:title,
                    groupId:groupId
                })
            }
        );
        if(!response.ok){
            throw new Error('Something went wrong!!');
        }
        const resData = await response.json();
        await dispatch({
            type:UPDATE_MEMBERS_BALANCES,
            groupId:groupId,
            groupMembers:members,
            groupTitle:title
        });
    }
}

export const deleteExpense = expenseId => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
      const response = await fetch(
        `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/expenses/${expenseId}.json`,
        {
          method: 'DELETE'
        }
      );
  
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      await dispatch({ type: DELETE_EXPENSE, expenseId: expenseId });
    };
  };