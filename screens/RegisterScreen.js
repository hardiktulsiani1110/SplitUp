import React , {useState,useEffect} from 'react'
import { ScrollView , KeyboardAvoidingView ,Alert,useWindowDimensions} from 'react-native';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import {useDispatch} from 'react-redux';
import { Input , Button} from 'react-native-elements';
import { signup } from '../store/actions/auth';
import { ActivityIndicator } from 'react-native';

const RegisterScreen = (props) => {
    const window = useWindowDimensions();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);
    
      const registerHandler = async () => {
        setError(null);
        setIsLoading(true);
        try {
          await dispatch(signup(email,password));
          props.navigation.navigate('Grps');
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };
    return (
        <KeyboardAvoidingView 
            style={styles.screen}
            behavior="padding"
            keyboardVerticalOffset={50}
        >
            <View style={{margin:window.height < 600 ? 30 : 80}}>
            </View>

            <View style={{margin:20}}>
                <Text style={styles.title}>SplitUp</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.register}>
                    <Text style={styles.registerText}>
                    Register
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        style={styles.input}
                        placeholder='Email Address'
                        autoFocus 
                        type='email'
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <Input
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry 
                        type='password'
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <View>
                    {isLoading === true ? (
                        <ActivityIndicator size="small" color="white"/>
                    ) : (<Button 
                        containerStyle={styles.button} 
                        title='Register'
                        onPress={registerHandler}
                    />)}
                    <Button 
                        containerStyle={styles.button} 
                        type='outline' 
                        title='Login'
                        onPress={() => {
                            props.navigation.replace('Login')
                        }}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    screen:{
        alignItems:'center',
        flexDirection:'column',
        flex:1,
        backgroundColor:'#6113d6',
    },
    title:{
        fontSize:35,
        color:'white'
    },
    inputContainer:{
        width:300,
        minWidth:200,
    },
    input:{
        color:'white'
    },
    container:{
        alignItems:'center',
    },
    register:{
        margin:30,
    },
    registerText:{
        fontSize:25,
        color:'white'
    },
    button:{
        width:150,
        marginTop:20,
        backgroundColor:'white',
        color:'#6113d6'
    }
});
