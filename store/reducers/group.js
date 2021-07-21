import { SET_GROUP } from "../actions/group";
import { UPDATE_MEMBERS_BALANCES } from "../actions/expenses";
const initialState = {
    groupId:null,
    groupTitle:null,
    groupMembers:[]
}

export default function(state = initialState,action){
    switch(action.type){
        case SET_GROUP:{
            return {
                groupId:action.groupId,
                groupTitle:action.groupTitle,
                groupMembers:action.groupMembers
            }
        }
        case UPDATE_MEMBERS_BALANCES:{
            return {
                groupId:state.groupId,
                groupTitle:action.groupTitle,
                groupMembers:action.groupMembers
            }
        }
        
        default:return state;
    }
}