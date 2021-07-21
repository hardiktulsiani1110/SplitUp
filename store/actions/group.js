export const SET_GROUP = 'SET_GROUP';

export const setGroup = (groupId,groupTitle,groupMembers) => {
    return {
        type:SET_GROUP,
        groupId:groupId,
        groupTitle:groupTitle,
        groupMembers:groupMembers
    }
};