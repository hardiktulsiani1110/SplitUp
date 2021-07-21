import React , {useState,useEffect,useCallback} from 'react'
import { StyleSheet, Text, View,Alert,ScrollView } from 'react-native'
import { Input } from 'react-native-elements'
import { HeaderButtons,Item } from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';

import CustomHeaderButton from '../components/CustomHeaderButton'
import { createGroup } from '../store/actions/groups';
import { ActivityIndicator } from 'react-native';
const _ = require('lodash');
const CreateGroupScreen = (props) => {
    const [title,setTitle] = useState("");
    const [member,setMember] = useState("");
    const [members,setMembers] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const addMemberHandler = () => {
        if(member.length === 0){
            return Alert.alert(
                "An error occured",
                "Member name cant be empty",
                [
                  { text: "Okay" }
                ]
              );
        }
        let updatedMembers = _.cloneDeep(members);
        updatedMembers.push({id:member,name:member,balance:0});
        setMembers(updatedMembers);
        setMember("");
    }

    const createGroupHandler = useCallback(async () => {
        setIsLoading(true);
        if(title.length <=0 ){
            setIsLoading(false);
            return Alert.alert(
                "Error in creating group",
                "Title should not be empty",
                [
                    {text:'Okay'}
                ]
            )
        }
        if(members.length <=1 ){
            setIsLoading(false);
            return Alert.alert(
                "Error in creating group",
                "There should be atleast two members in a group",
                [
                    {text:'Okay'}
                ]
            )
        }
        await dispatch(createGroup(title,members));
        setIsLoading(false);
        props.navigation.goBack();
    },[dispatch,title,members]);
    
    

    useEffect(() => {
        props.navigation.setParams({createGroupHandlerFn:createGroupHandler});
    },[createGroupHandler]);

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color='#6113d6' />
            </View>
        )
    }

    return (
        <ScrollView style={styles.screen}>
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Group Title</Text>
                <Input
                    placeholder="Group title"
                    value={title}
                    onChangeText = {text => setTitle(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Members</Text>
                <Input
                    placeholder="(maximum 10 characters)"
                    value={member}
                    onChangeText = {text => setMember(text)}
                    rightIcon={
                        <Icon
                            name="add-circle-outline"
                            size={25}
                            color='#6113d6'
                            onPress={addMemberHandler}
                        />
                    }
                />
            </View>
        </View>
        
            {members.length > 0 && (
                <ScrollView>
                    <View style={styles.memberList}>
                    {members.map(mem => (
                        <View key = {mem.id} style={styles.member}>
                            <Text style={{fontSize:18}}>{mem.name}</Text>
                        </View>
                    ))}
                    </View>
                </ScrollView>
            )}
        </ScrollView>
    )
}

CreateGroupScreen.navigationOptions = navData => {
    const createGroupHandlerFn = navData.navigation.getParam('createGroupHandlerFn');
    return {
        headerStyle:{
            backgroundColor:'#6113d6'
        },
        headerTitleStyle:{
            textAlign:'center',
        },
        headerTintColor:'white',
        title:'Create Group',
        headerRight:() => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="create" iconName="checkmark-circle-outline" onPress={createGroupHandlerFn} />
            </HeaderButtons>
        )
    }
}

export default CreateGroupScreen

const styles = StyleSheet.create({
    screen:{
        margin:20,
      
    },
    formContainer:{
        alignItems:'center',
        justifyContent:'center'
    },
    title:{
        color:'#6113d6',
        fontWeight:'bold',
        fontSize:20
    },
    inputContainer:{
        width:'80%',
        alignItems:'center',
        marginBottom:15
    },
    memberList:{
        alignItems:'center'
    },
    member:{
        width:'60%',
        borderBottomWidth:1,
        borderBottomColor:'#6113d6',
        margin:15,
        alignItems:'center'
    },
    centered:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})
