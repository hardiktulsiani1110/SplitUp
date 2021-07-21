import React,{useEffect,useState,useCallback} from 'react'
import { StyleSheet, Text, View,ActivityIndicator,ScrollView,FlatList,Button,TouchableOpacity,Alert } from 'react-native'
import { useDispatch,useSelector } from 'react-redux'
import { fetchExpenses,deleteExpense } from '../store/actions/expenses';
import {Icon as RNIcon} from 'react-native-elements';
import ExpenseItem from '../components/ExpenseItem';

const GroupExpensesScreen = (props) => {
    const [error,setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const expenses = useSelector(state => state.expenses.groupExpenses);
    const dispatch = useDispatch();

    const deleteExpenseHandlerFn = async (expenseId) => {
      setIsLoading(true);
      Alert.alert('Are you sure?', 'Do you really want to delete this expense?', [
        { text: 'No', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteExpense(expenseId));
            setIsLoading(false);
          }
        }
      ]);
      setIsLoading(false);
    }

    const loadExpenses = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(fetchExpenses());
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
            setError(err.message);
        }
    },[dispatch,setIsLoading,setError]);

    useEffect(() => {
        loadExpenses();
    },[dispatch,loadExpenses]);

    if (error) {
        return (
          <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button
              title="Try again"
              onPress={loadExpenses}
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
    
      if (!isLoading && expenses.length === 0) {
        return (
          <View style={styles.centered}>
            <Text>No expenses found!!.</Text>
              <RNIcon
                  name='add-circle'
                  type='ionicon'
                  color='#c910cc'
                  containerStyle={styles.FloatingButtonStyle}
                  size={60}
                  onPress={() => {
                    props.navigation.navigate('CreateExpense')
                  }}
              />
          </View>
          
        );
      }

    return (
      <View style={{flex:1}}>
      <ScrollView style={styles.container}> 
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <ExpenseItem
              title={itemData.item.title}
              amount={itemData.item.amount}
              paidBy={itemData.item.paidBy}
              paidTo={itemData.item.paidTo}
              id={itemData.item.id}
              date = {itemData.item.readableDate}
              deleteExpenseHandler={deleteExpenseHandlerFn.bind(this,itemData.item.id)}
            />
          )}
        /> 
      </ScrollView>
          <RNIcon
              name='add-circle'
              type='ionicon'
              color='#c910cc'
              containerStyle={styles.FloatingButtonStyle}
              size={60}
              onPress={() => {
                props.navigation.navigate('CreateExpense')
              }}
          />
      </View>
    )
}

export default GroupExpensesScreen

const styles = StyleSheet.create({
    container:{

    },
    centered:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    }, 
    FloatingButtonStyle: {
      overflow:'hidden',
      resizeMode: 'contain',
      width: 70,  
      height: 70,                                       
      position: 'absolute',                                          
      bottom: 10,                                                    
      right: 10, 
    }
})