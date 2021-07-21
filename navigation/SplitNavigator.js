import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import GroupOverviewScreen from '../screens/GroupOverviewScreen';
import GroupExpensesScreen from '../screens/GroupExpensesScreen';
import GroupPaymentsScreen from '../screens/GroupPaymentsScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import GroupsScreen from '../screens/GroupsScreen';
import StartupScreen from '../screens/StartupScreen';
import AddMembersScreen from '../screens/AddMembersScreen';

const AuthNavigator = createStackNavigator({
    Login:LoginScreen,
    Register:RegisterScreen
},{
    headerMode:'none'
});

const GroupExpenseNavigator = createStackNavigator({
  GroupExpenses:GroupExpensesScreen,
  CreateExpense:{
    screen:CreateExpenseScreen,
    navigationOptions:{
      tabBarVisible:false,
    }
  }
},{
  headerMode:'none'
});

GroupExpenseNavigator.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'CreateExpense' ) {
      tabBarVisible = false
  }

  return {
      tabBarVisible,
  }
}

const GroupOverviewNavigator = createStackNavigator({
  GroupOverview:GroupOverviewScreen,
  AddMembers:{
    screen:AddMembersScreen,
    navigationOptions:{
      tabBarVisible:false,
    }
  }
},
{
  headerMode:'none'
}
);

GroupOverviewNavigator.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'AddMembers' ) {
      tabBarVisible = false
  }
  return {
      tabBarVisible,
  }
}

const GroupNavigator = createMaterialTopTabNavigator({
  Overview:GroupOverviewNavigator,
  Expenses:GroupExpenseNavigator,
  Payments:GroupPaymentsScreen
},{
  tabBarOptions:{
    activeTintColor:'white',
    contentContainerStyle:{
      backgroundColor:'#6113d6'
    }
  },
});

GroupNavigator.navigationOptions = ({ navigation }) => {
  
  return {
      headerTitle:navigation.getParam('title'),
  }
}

const GroupsNavigator = createStackNavigator({
  Groups:GroupsScreen,
  Group:{
    screen:GroupNavigator,
    navigationOptions:{
      headerStyle:{
        backgroundColor:'#6113d6'
      },
      headerTitleAlign:'center',
      headerTintColor:'white'
    },
  },
  CreateGroup:CreateGroupScreen
});

const MainNavigator = createSwitchNavigator({
  Startup:StartupScreen,
  Auth:AuthNavigator,
  Grps:GroupsNavigator
})

export default createAppContainer(MainNavigator);