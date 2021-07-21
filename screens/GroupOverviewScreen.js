import React ,{useCallback,useEffect,useState}from 'react'
import { StyleSheet, Text, View,FlatList ,ActivityIndicator,Button,ScrollView} from 'react-native'
import { useSelector,useDispatch } from 'react-redux';
import {setGroup} from '../store/actions/group';
import {Icon as RNIcon} from 'react-native-elements';
const GroupOverviewScreen = (props) => {
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);
    const dispatch = useDispatch();
    const groupMembers = useSelector(state => state.group.groupMembers);
    const groupTitle = useSelector(state => state.group.groupTitle);
    const groupId = useSelector(state => state.group.groupId);

    const loadGroup = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(setGroup(groupId,groupTitle,groupMembers));
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
            setError(err.message);
        }
    },[dispatch,setIsLoading,setError]);

    useEffect(() => {
        loadGroup();
    },[dispatch,loadGroup]);


    const renderItem = ({item}) => {
        return (
              <View style={styles.listItem}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.balance >= 0 ? (<Text style={styles.balancePos}>{item.balance}</Text>) : 
                    (<Text style={styles.balanceNeg}>
                        {item.balance}
                    </Text>)
                  }
              </View>
        )
      }

      if (error) {
        return (
          <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button
              title="Try again"
              onPress={loadGroups}
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
      
    return (
        <View style={styles.screen}>
        <ScrollView>
            <View style={styles.heading}>
                <View><Text style={styles.headingText}>Name</Text></View>
                <View><Text style={styles.headingText}>Balance</Text></View>
            </View>
            <FlatList
                data={groupMembers}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </ScrollView>
            <RNIcon
                  name='add-circle'
                  type='ionicon'
                  color='#c910cc'
                  containerStyle={styles.FloatingButtonStyle}
                  size={60}
                  onPress={() => {
                    props.navigation.navigate('AddMembers',{
                        groupId,
                        groupTitle,
                        groupMembers
                    });
                  }}
              />
        </View>
    )
}

export default GroupOverviewScreen

const styles = StyleSheet.create({
    heading:{
        flexDirection:'row',
        justifyContent:'space-around',
        width:300,
        marginVertical:20,
        
    },
    headingText:{
        color:'#6113d6',
        fontWeight:'bold',
        fontSize:20
    },
    listItem:{
        flexDirection:'row',
        justifyContent:'space-around',
        height:40,
        borderBottomWidth:1,
        borderBottomColor:'#6113d6',
        width:300,
        marginTop:10
    },
    screen:{
        alignItems:'center',
        width:'100%',
        flex:1
    },
    name:{
        color:'black',
        fontWeight:'bold',
        fontSize:18,
        marginRight:10
    },
    balancePos:{
        color:'#07a81c',
        fontWeight:'bold',
        fontSize:18,
        marginLeft:10
    },
    balanceNeg:{
        color:'#de0000',
        fontWeight:'bold',
        fontSize:18,
        marginLeft:10
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
