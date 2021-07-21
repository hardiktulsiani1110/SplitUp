import React , {useState,useEffect,useCallback,useLayoutEffect} from 'react'
import { StyleSheet, Text, View,Alert,ScrollView,ActivityIndicator ,Button, TouchableOpacity} from 'react-native'
import { Input  } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch , useSelector } from 'react-redux';
import { addExpense } from '../store/actions/expenses';
import { addPayment } from '../store/actions/payments';
import { updateMembersBalances } from '../store/actions/expenses';
import { FlatList } from 'react-native-gesture-handler';
import { fetchGroups } from '../store/actions/groups';
const _ = require('lodash');

const CreateExpenseScreen = (props) => {
    const [isLoading,setIsLoading] = useState(false);
    const [isButtonLoading,setIsButtonLoading] = useState(false);
    const [title,setTitle] = useState("");
    const [amount,setAmount] = useState(0.00);
    const [isPaidByLoading,setIsPaidByLoading] = useState(false);
    const [isPaidToLoading,setIsPaidToLoading] = useState(false);
    const [paidByPeople,setPaidByPeople] = useState([]);
    const [paidToPeople,setPaidToPeople] = useState([]);
    const groupMembers = useSelector(state => state.group.groupMembers);

    const dispatch = useDispatch();

    useEffect(() => {
        props.navigation.setParams({submitExpenseHandlerFn:submitExpenseHandler});
    },[submitExpenseHandler]);

    const paidByPeopleHandler = useCallback((id,name,balance) => {
        setIsPaidByLoading(true);
        var flag = 0;
        for(var i=0;i<paidByPeople.length;i++){
            if(paidByPeople[i].id === id){
                flag = 1;
                break;
            }
        }
        if(flag === 0){
            //adding as it is not present in the list
            let updatedPaidByPeople = _.cloneDeep(paidByPeople);
            updatedPaidByPeople.push({id,name,balance});
            setPaidByPeople(updatedPaidByPeople);
        }else{
            //removing as it is already present
            let updatedPaidByPeople = paidByPeople.filter(mem => mem.id !== id);
            setPaidByPeople(updatedPaidByPeople);
        }
        setIsPaidByLoading(false);
    });

    const paidToPeopleHandler = useCallback((id,name,balance) => {
        setIsPaidToLoading(true);
        var flag = 0;
        for(var i=0;i<paidToPeople.length;i++){
            if(paidToPeople[i].id === id){
                flag = 1;
                break;
            }
        }
        if(flag === 0){
            //adding as it is not present in the list
            let updatedPaidToPeople = _.cloneDeep(paidToPeople);;
            updatedPaidToPeople.push({id,name,balance});
            setPaidToPeople(updatedPaidToPeople);
        }else{
            //removing as it is already present
            let updatedPaidToPeople = paidToPeople.filter(mem => mem.id !== id);
            setPaidToPeople(updatedPaidToPeople);
        }
        setIsPaidToLoading(false);
    });

    const renderItem2 = ({item}) => {
        return (<View style={styles.container} key={item.id}>
         <View style={styles.containerItem}>
         <TouchableOpacity activeOpacity={0.2} onPress={paidByPeopleHandler.bind(this,item.id,item.name,item.balance)}>
            <Icon
                name="add-circle-outline"
                size={28}
                type='ionicon'
                color='#6113d6'
                
            />
        </TouchableOpacity>
    </View>
    <View style={styles.containerItem2}>
        <Text style={{fontSize:18}}>{item.name}</Text>
    </View>
    <View style={styles.containerItem}>
    <TouchableOpacity activeOpacity={0.2} onPress={paidToPeopleHandler.bind(this,item.id,item.name,item.balance)}>
        <Icon
            name="add-circle-outline"
            size={28}
            type='ionicon'
            color='#6113d6'
            
        />
    </TouchableOpacity>
    </View>
    </View>)
    }

    const renderItem = ({item}) => {
        return (<View key={item.id} style={styles.listItem}>
            <Text style={styles.name}>{item.name}</Text>
        </View>);
    }    

    const submitExpenseHandler = async () => {
        setIsButtonLoading(true);
        if(title.length === 0){
            setIsButtonLoading(false);
            console.log("Title shouldn't be empty!!");
            return Alert.alert(
                "Error",
                "Title shouldn't be empty!!",
                [
                    {text:'Okay'}
                ]
            )
        }
        if(isNaN(amount)){
            setIsButtonLoading(false);
            console.log("Amount Should be a number!!");
            return Alert.alert(
                "Error",
                "Amount Should be a number!!",
                [
                    {text:'Okay'}
                ]
            )
        }
        if(amount === 0){
            setIsButtonLoading(false);
            console.log("Enter Amount please!!");
            return Alert.alert(
                "Error",
                "Enter Amount please!!",
                [
                    {text:'Okay'}
                ]
            )
        }
        if(paidByPeople.length <=0 ){
            setIsButtonLoading(false);
            console.log("There should be atleast one member to pay the bill!!");
            return Alert.alert(
                "Error",
                "There should be atleast one member to pay the bill!!",
                [
                    {text:'Okay'}
                ]
            )
        }
        if(paidToPeople.length <=0 ){
            setIsButtonLoading(false);
            console.log("There should be atleast one member for whom the bill is paid!!");
            return Alert.alert(
                "Error",
                "There should be atleast one member for whom the bill is paid!!",
                [
                    {text:'Okay'}
                ]
            )
        }
        let members = _.cloneDeep(groupMembers);
        let members2 = _.cloneDeep(groupMembers);
        let paidByDictionary = {};
        // let paidByShare = (paidByPeople.length === 2) ? (amount/paidByPeople.length).toFixed(2) : Math.floor(amount/paidByPeople.length);
        let paidByShare = Math.floor(amount/paidByPeople.length);
        let paidToDictionary = {};
        let payers = [];
        let burrowers = [];
        // let paidToShare = (paidToPeople.length === 2) ? (amount/paidToPeople.length).toFixed(2) : Math.floor(amount/paidToPeople.length);
        let paidToShare = Math.floor(amount/paidToPeople.length);
        const initialize = () => {
            for(var i=0;i<members.length;i++){
                const pid  = members[i].id;
                paidByDictionary[pid] = 0;
                paidToDictionary[pid] = 0;
            }
            for(var i=0;i<paidByPeople.length;i++){
                const pid  = paidByPeople[i].id;
                paidByDictionary[pid] = paidByShare;
            }
            for(var i=0;i<paidToPeople.length;i++){
                const pid  = paidToPeople[i].id;
                paidToDictionary[pid] = paidToShare;
            }
        }
        await initialize();

        const xyz = () => {
            for(var i=0;i<members.length;i++){
                const pid  = members[i].id;
                members[i].balance = members[i].balance + paidByDictionary[pid] - paidToDictionary[pid];

                members2[i].balance = paidByDictionary[pid] - paidToDictionary[pid];
                if(members2[i].balance > 0){
                    payers.push(members2[i]);
                }else if(members2[i].balance < 0){
                    burrowers.push(members2[i]);
                }

            }
        }
        await xyz();
        await dispatch(updateMembersBalances(members));
        await dispatch(addExpense(title,amount,paidByPeople,paidToPeople));
        await dispatch(fetchGroups());
        
        payers.sort(function(a,b){
            if(a.balance > b.balance)   return 1;
            if(a.balance < b.balance)   return -1;
            return 0;
        });
        burrowers.sort(function(a,b){
            if(a.balance > b.balance)   return -1;
            if(a.balance < b.balance)   return 1;
            return 0;
        });

        var pa=0,bu=0;
        while(pa<payers.length && bu<burrowers.length){
            if(payers[pa].balance > -1 * burrowers[bu].balance){
                payers[pa].balance = payers[pa].balance + burrowers[bu].balance;
                await dispatch(addPayment(-1*burrowers[bu].balance,payers[pa].id,payers[pa].name,burrowers[bu].id,burrowers[bu].name,title));
                bu++;
            }else if(payers[pa].balance < -1 * burrowers[bu].balance){
                burrowers[bu].balance = burrowers[bu].balance + payers[pa].balance;
                await dispatch(addPayment(payers[pa].balance,payers[pa].id,payers[pa].name,burrowers[bu].id,burrowers[bu].name,title));
                pa++;
            }else{
                await dispatch(addPayment(payers[pa].balance,payers[pa].id,payers[pa].name,burrowers[bu].id,burrowers[bu].name,title));
                pa++;
                bu++;
            }
        }

        setIsButtonLoading(false);
        props.navigation.goBack();
    }


    if(isLoading){
        return (
            <View style={styles.centered}><ActivityIndicator size='large' color='#6113d6'/></View>
        )
    }
    return (
        <ScrollView style={styles.screen}>
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Expense Title:</Text>
                <Input
                    placeholder="(maximum 10 characters)"
                    value={title}
                    onChangeText = {text => setTitle(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Amount:</Text>
                <Input
                    placeholder="Expense Amount"
                    value={amount}
                    onChangeText={text => setAmount(text)}
                />
            </View>
            <View>
                <View style={styles.inputContainer}>
                    <View style={styles.container}>
                        <View style={styles.containerItem}><Text style={styles.title}>Paid By</Text></View>
                        <View style={styles.containerItem}><Text style={styles.title}>Members</Text></View>
                        <View style={styles.containerItem}><Text style={styles.title}>Paid To</Text></View>
                    </View>
                    <FlatList
                       data={groupMembers}
                        renderItem={renderItem2}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Paid By</Text>
                {isPaidByLoading ? (<ActivityIndicator size='small' color='#6113d6'/>) : (
                    <FlatList
                        data={paidByPeople}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Paid To</Text>
                {isPaidToLoading ? (<ActivityIndicator size='small' color='#6113d6'/>) : (
                    <FlatList
                        data={paidToPeople}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                )}
            </View>
            {isButtonLoading ? <ActivityIndicator color = '#6113d6' size='small'/> : (
            <View style={{width:'60%',flexDirection:'row',justifyContent:'center'}}>
                <Button
                    onPress={submitExpenseHandler}
                    title="Add Expense"
                    color='#6113d6'
                />
            </View>)}
        </View>
        </ScrollView>
    )
}

export default CreateExpenseScreen

const styles = StyleSheet.create({
    formContainer:{
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10
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
    listItem:{
        flexDirection:'row'
    },
    checkbox:{
        marginHorizontal:6
    },
    centered:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    container:{
        flexDirection:'row',
        justifyContent:'space-around',
    },
    containerItem:{
        margin:15
    },
    containerItem2:{
        marginVertical:15,
        marginHorizontal:45
    },
    name:{
        fontSize:18
    }
})
