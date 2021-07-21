import Group from '../../models/Group';
import { SET_GROUPS,CREATE_GROUP,DELETE_GROUP} from "../actions/groups";

const initialState = {
    groups:[]
}

export default function(state = initialState,action){
    switch(action.type){
        case SET_GROUPS:{
            return {
                groups:action.groups
            }
        }
        case CREATE_GROUP:{
            const newGroup = new Group(
                action.groupData.id,
                action.groupData.title,
                action.groupData.members
            )
            return {
                ...state,
                groups:state.groups.concat(newGroup)
            }
        }
        case DELETE_GROUP:{
            return {
                ...state,
                groups:state.groups.filter(group => group.id !== action.groupId)
            }
        }
        default: return state;
    }
}