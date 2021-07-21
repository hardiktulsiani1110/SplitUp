import React,{useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View,ActivityIndicator ,FlatList,SafeAreaView,TouchableOpacity,Button,Alert} from 'react-native'
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups ,deleteGroup} from '../store/actions/groups';
import { setGroup } from '../store/actions/group';
import { Icon } from 'react-native-elements';
import CustomHeaderButton from '../components/CustomHeaderButton';
import {logout} from '../store/actions/auth';
const _ = require('lodash');

const GroupsScreen = (props) => {
    const [error,setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const groups = useSelector(state => state.groups.groups);
    const dispatch = useDispatch();

    const deleteGroupHandler = (id) => {
      setIsLoading(true);
      Alert.alert('Are you sure?', 'Do you really want to delete this group? Please make sure to delete the group expenses and payments first!!', [
        { text: 'No', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteGroup(id));
            setIsLoading(false);
          }
        }
      ]);
      setIsLoading(false);
    }

    const loadGroups = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(fetchGroups());
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
            setError(err.message);
        }
    },[dispatch,setIsLoading,setError]);

    const logoutHandler = useCallback(() => {
          try{
          dispatch(logout());
        }catch(err){
          console.log(err.message);
        }
    },[dispatch]);
    

    useEffect(() => {
        loadGroups();
    },[dispatch,loadGroups]);

    useEffect(() => {
      props.navigation.setParams({logoutHandler:logoutHandler});
    },[logoutHandler]);

    const renderItem = ({item}) => {
      return (
        <TouchableOpacity 
        onPress={async () => {
            await dispatch(setGroup(item.id,item.title,item.members));
            props.navigation.navigate('Group',{
              title:item.title
            });
          }
          }
        >
        <View style={styles.group}>
          <View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity activeOpacity={0.5} onPress={deleteGroupHandler.bind(this,item.id)}>
                    <Icon
                      containerStyle={styles.deleteContainer}
                      type='antdesign'
                      color='#de0000'
                      name='delete'
                      size={28}
                    />
              </TouchableOpacity>
            </View>
              <View style={styles.memberList} >
                <Text style={styles.memberText}>Members:</Text>
                {item.members.map(mem => 
                  (<View key={mem.id}>
                    <Text style={styles.memberName}>{mem.name},</Text>
                  </View>)
                )}
              </View>
              
          </View>
        </View>
        </TouchableOpacity>
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
    
      if (!isLoading && groups.length === 0) {
        return (
          <View style={styles.centered}>
            <Text>No groups found!! Click the top right icon to add</Text>
          </View>
        );
      }

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    )
}

GroupsScreen.navigationOptions = navData => {
    const logoutHandlerFn = navData.navigation.getParam('logoutHandler');
    return {
        headerStyle:{
            backgroundColor:'#6113d6',
        },
        headerTitleStyle:{
            textAlign:'center',
        },
        headerTintColor:'white',
        title:'Groups',
        headerRight:() => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="add" iconName="add-circle-outline" onPress={() => {navData.navigation.navigate('CreateGroup')}} />
            </HeaderButtons>
        ),
        headerLeft:() => (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item title="logout" iconName="log-out-outline" onPress={() => {
                logoutHandlerFn();
              }} />
          </HeaderButtons>
        )
    }
}

export default GroupsScreen

const styles = StyleSheet.create({
  centered:{
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  container:{
    
  },
  group:{
    borderBottomWidth:1,
    borderBottomColor:'#6113d6',
    width:'100%',
    height:65
  },
  title:{
    color:'#6113d6',
    marginLeft:25,
    marginTop:5,
    fontWeight:'bold',
    fontSize:22
  },
  memberList:{
    flexDirection:'row',
    marginLeft:25,
    marginRight:30,
    paddingRight:15,
  },
  memberName:{
    color:'#de18d1',
    fontSize:14
  },
  memberText:{
    color:'#050e6e',
    fontSize:14
  },
  deleteContainer:{
    marginRight:10,
    marginTop:5
  },
})