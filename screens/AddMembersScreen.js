import React , {useState} from 'react'
import { StyleSheet, Text, View,Alert,ScrollView,TouchableOpacity,Button } from 'react-native'
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch,useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';
const _ = require('lodash');
import { updateMembersBalances } from '../store/actions/expenses';
import { fetchGroups } from '../store/actions/groups';

const AddMembersScreen = (props) => {
    const [isLoading,setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [extraMembers,setExtraMembers] = useState([]);
    const [extraMember,setExtraMember] = useState("");
    const groupMembers = useSelector(state => state.group.groupMembers);

    const addExtraMemberHandler = () => {
        if(extraMember.length === 0){
            return Alert.alert(
                "An error occured",
                "Member name cant be empty",
                [
                  { text: "Okay" }
                ]
              );
        }
        let updatedMembers =_.cloneDeep(extraMembers);
        updatedMembers.push({id:extraMember,name:extraMember,balance:0});
        setExtraMembers(updatedMembers);
        setExtraMember("");
    }

    const updateGroupHandler = async () => {
        setIsLoading(true);
        if(extraMembers.length < 1 ){
            setIsLoading(false);
            return Alert.alert(
                "Error in adding member group",
                "There should be atleast one new member",
                [
                    {text:'Okay'}
                ]
            )
        }
        let updatedMembers = _.cloneDeep(groupMembers);
        for(let i=0;i<extraMembers.length;i++){
            updatedMembers.push(extraMembers[i]);
        }
        await dispatch(updateMembersBalances(updatedMembers));
        await dispatch(fetchGroups());
        setIsLoading(false);
        props.navigation.goBack();
    };

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
                <Text style={styles.title}>New Members</Text>
                <Input
                    placeholder="(maximum 10 characters)"
                    value={extraMember}
                    onChangeText = {text => setExtraMember(text)}
                    rightIcon={
                        <Icon
                            name="add-circle-outline"
                            size={25}
                            color='#6113d6'
                            onPress={addExtraMemberHandler}
                        />
                    }
                />
            </View>
        </View>
        
            {extraMembers.length > 0 && (
                <ScrollView>
                    <View style={styles.memberList}>
                    {extraMembers.map(mem => (
                        <View key = {mem.id} style={styles.member}>
                            <Text style={{fontSize:18}}>{mem.name}</Text>
                        </View>
                    ))}
                    </View>
                </ScrollView>
            )}
            <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
            <TouchableOpacity activeOpacity={0.5} >
                <Button
                    color="#6113d6"
                    title='Add Members'
                    onPress={updateGroupHandler}
                />
            </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
    )
}

AddMembersScreen.navigationOptions = navData => {
    
}

export default AddMembersScreen

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
});