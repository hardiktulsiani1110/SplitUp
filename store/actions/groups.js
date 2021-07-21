import Group from '../../models/Group';

export const SET_GROUPS = 'SET_GROUPS';
export const CREATE_GROUP = 'CREATE_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const fetchGroups = () => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/groups.json`,
            {
                method:'GET',
                headers:{
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Authorization, X-Requested-With,Access-Control-Allow-Credentials",
                    "Access-Control-Allow-Credentials": "true"
                }
            }
        );
        if(!response.ok){
            throw new Error("something went wrong!!");
        }
        const resData = await response.json();
        const loadedGroups = [];
        for(const key in resData){
            loadedGroups.push(
                new Group(
                    key,
                    resData[key].title,
                    resData[key].members
                )
            );
        };
        dispatch({type:SET_GROUPS,groups:loadedGroups});
    }
};

export const createGroup = (title,members) => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const response = await fetch(
            `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/groups.json`,
            {
                method:"POST",
                headers:{
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    title:title,
                    members:members
                })
            }
        );
        if(!response.ok){
            throw new Error("something went wrong!!");
        }
        const resData = await response.json();
        dispatch({
            type:CREATE_GROUP,
            groupData:{
                id:resData.name,
                members,
                title,
            }
        });
    }
};

export const deleteGroup = groupId => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
      const response = await fetch(
        `https://splitup-db17f-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/groups/${groupId}.json`,
        {
          method: 'DELETE'
        }
      );
  
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      await dispatch({ type: DELETE_GROUP, groupId: groupId });
    };
  };
