import React,{useEffect,useState,useCallback} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,ActivityIndicator,SafeAreaView,FlatList ,Button, Alert} from 'react-native'
import { useDispatch,useSelector } from 'react-redux'
import { fetchPayments,settlePayment,deletePayment } from '../store/actions/payments';
import {Icon} from 'react-native-elements';
import { updateMembersBalances } from '../store/actions/expenses';
import { fetchGroups } from '../store/actions/groups';
import Card from '../components/Card';
const GroupPaymentsScreen = (props) => {
    const [error,setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const payments = useSelector(state => state.payments.groupPayments);
    const groupMembers = useSelector(state => state.group.groupMembers);
    const dispatch = useDispatch();

    useEffect(() => {
      props.navigation.setParams({paymentHandlerFn:paymentHandler});
  },[paymentHandler]);

    const loadPayments = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(fetchPayments());
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
            setError(err.message);
        }
    },[dispatch,setIsLoading,setError]);

    useEffect(() => {
        loadPayments();
    },[dispatch,loadPayments]);

    const paymentHandler = async (paymentId,amount,payerId,payerName,burrowerId,burrowerName,expenseTitle) => {
      setIsLoading(true);
      let existingMembers = groupMembers.filter(member => (member.id !== payerId && member.id !== burrowerId));
      let payerMember = groupMembers.find(member => member.id === payerId);
      payerMember.balance = payerMember.balance - amount;
      let burrowerMember = groupMembers.find(member => member.id === burrowerId);
      burrowerMember.balance = burrowerMember.balance + amount;
      existingMembers.push(payerMember);
      existingMembers.push(burrowerMember);
      await dispatch(settlePayment(paymentId,amount,payerId,payerName,burrowerId,burrowerName,expenseTitle,true));
      await dispatch(updateMembersBalances(existingMembers));
      await dispatch(fetchGroups());
      await dispatch(fetchPayments());
      setIsLoading(false);
    }

    const deletePaymentHandler = async (paymentId) => {
      setIsLoading(true);
      await dispatch(deletePayment(paymentId));
      setIsLoading(false);
    }

    const renderItem = ({item}) => {
      return (
        <Card style={styles.paymentItem}>
          <View style={styles.summary}>
                <Text style={styles.title}>{item.expenseTitle}</Text>
                {item.isSettled ? (
                  <View style={styles.settleContainer}>
                    <Text style={styles.settled}>Settled</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={deletePaymentHandler.bind(this,item.id)}>
                    <Icon
                      containerStyle={styles.deleteContainer}
                      type='antdesign'
                      color='#de0000'
                      name='delete'
                    />
                    </TouchableOpacity>
                  </View>
                ) : (<Button
                      color='#6113d6'
                      title='Settle'
                      onPress={paymentHandler.bind(this,item.id,item.amount,item.payerId,item.payerName,item.burrowerId,item.burrowerName,item.expenseTitle)}
                />)}
          </View>
          <View style={styles.mainTextContainer}>
            <Text style={styles.burrower}>{item.burrowerName} </Text>
            <Text style={{fontSize:18}}>owes </Text>
            <Text style={styles.payer}>{item.payerName} </Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
        </Card>
      )
    }
    

    if (error) {
        return (
          <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button
              title="Try again"
              onPress={loadPayments}
              color='#6113d6'
            />
          </View>
        );
      }
    
      if (isLoading) {
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color='#6113d6' />
          </View>
        );
      }
    
      if (!isLoading && payments.length === 0) {
        return (
          <View style={styles.centered}>
            <Text>No payments left!!</Text>
          </View>
          
        );
      }

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    )
}

export default GroupPaymentsScreen

const styles = StyleSheet.create({
    centered:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    container:{
      
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    paymentItem: {
      margin: 20,
      padding: 10,
      alignItems: 'center'
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 15
    },
    settled:{
      color:'#07a81c',
      marginHorizontal:15,
      fontSize:16
    },
    mainTextContainer:{
      flexDirection:'row'
    },
    settleContainer:{
      flexDirection:'row',
    },
    deleteContainer:{
      marginRight:10
    },
    title: {
      fontSize: 20,
      color: '#6113d6',
      fontWeight:'bold'
    },
    burrower:{
      color:'#de0000',
      fontWeight:'bold',
      fontSize:18
    },
    payer:{
      color:'#07a81c',
      fontWeight:'bold',
      fontSize:18
    },
    amount:{
      color:'black',
      fontWeight:'bold',
      fontSize:18
    },

})