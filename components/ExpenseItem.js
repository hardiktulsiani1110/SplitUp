import React,{useState} from 'react'
import { StyleSheet, Text, View,Button,FlatList,TouchableOpacity } from 'react-native'
import Card from './Card';
import {Icon} from 'react-native-elements';

const ExpenseItem = ({id,title,amount,paidBy,paidTo,deleteExpenseHandler,date}) => {
    const [showDetails,setShowDetails] = useState(false);
    const renderItem = ({item}) => {
        return (
            <View>
                <Text style={{fontSize:16}}>{item.name}</Text>
            </View>
        )
    }
    return (
        <Card style={styles.expenseItem}>
            <View style={styles.summary}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.amount}>{amount}</Text>
            </View>
            <View style={styles.summary2}>
                <Button
                    color="#6113d6"
                    title={showDetails ? 'Hide Details' : 'Show Details'}
                    onPress={() => {
                        setShowDetails(prevState => !prevState);
                    }}
                />
                <TouchableOpacity activeOpacity={0.5} onPress={() => {deleteExpenseHandler(id)}}>
                    <Icon
                      containerStyle={styles.deleteContainer}
                      type='antdesign'
                      color='#de0000'
                      name='delete'
                      size={28}
                    />
                </TouchableOpacity>
            </View>
            {showDetails && (
                <View style={styles.paidContainer}>
                    <View style={styles.paid}>
                        <Text style={styles.paidTitle}>Paid By</Text>
                        <FlatList
                            data={paidBy}
                            listKey={item => item.id}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                    <View style={styles.paid}>
                        <Text style={styles.paidTitle}>Paid To</Text>
                        <FlatList
                            data={paidTo}
                            listKey={item => item.id}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                </View>
            )}
        </Card>
    )
}

export default ExpenseItem

const styles = StyleSheet.create({
    expenseItem: {
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
      summary2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
      },
      amount: {
        fontSize: 18,
        fontWeight:'bold'
      },
      title: {
        fontSize: 20,
        color: '#6113d6',
        fontWeight:'bold'
      },
      date:{
        color:'#9da8a0',
        fontSize:18
      },
      paidContainer:{
        flexDirection:'row',
        justifyContent:'space-around'
      },
      paid:{
        alignItems:'center',
        flexDirection:'column',
        marginVertical:10,
        marginHorizontal:10
      },
      paidTitle:{
          color:'black',
          fontWeight:'bold',
          fontSize:18
      },
      deleteContainer:{
        marginRight:10,
        marginLeft:10
      },
})

