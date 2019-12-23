import React, {useState,useEffect} from 'react';
import {SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png'
import api from '../services/api'
import { AsyncStorage } from 'react-native';
import io from 'socket.io-client'


export default props=>{
    const user_id= props.navigation.getParam('user');
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(false);

    useEffect(()=>{
        const socket = io('http://192.168.4.17:3333',{
            query: {user: user_id},
        });


        socket.on('match', dev=>{
            setMatchDev(dev);
            console.log('Teste')
        })
        
    },[user_id])


    useEffect(()=>{
        async function loadUsers(){
            const response = await api.get('/devs',{
                headers:{ user: user_id}
            })

            setUsers(response.data);

        }

        loadUsers()
    }, [user_id]);

    async function handleLike(){
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers:{
                user: user_id
            }
        });

        setUsers(rest)
    }

    async function handleDislike(){
        const [user, ...rest] = users;
        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers:{
                user: user_id
            }
        });

        setUsers(rest)
    }

    async function handleLogout(){
        await AsyncStorage.clear()

        props.navigation.navigate('Login')
    }


    return(
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout}>
            <Image source={logo} style={styles.logo}/>
        </TouchableOpacity>
        

        <View style={styles.cardsContainer}>
            {
                users.length === 0 ? <Text style={styles.empty}>Acabou :( </Text> : (
                    users.map((user,index)=>(
                        <View style={[styles.card,{zIndex: users.length - index}]} key={user._id}>
                            <Image 
                            style={styles.avatar} 
                            source={{uri: user.avatar}}/>
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                )
            }
        </View>
        { users.length>0 ? (<View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDislike}>
                <Image source={dislike} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLike}>
                <Image source={like} />
            </TouchableOpacity>
        </View>) : <View></View>}
        { matchDev && (
            <View style={styles.matchContainer}>
                <Image style={styles.matchImage} source={itsamatch}></Image>
                <Image source={{uri: matchDev.avatar}} style={styles.matchAvatar}></Image>
                <Text style={styles.matchName}>{matchDev.name}</Text>
                <Text style={styles.matchBio}>{matchDev.bio}</Text>
                <TouchableOpacity onPress={()=>setMatchDev(false)}>
                    <Text style={styles.closeMatch}>FECHAR</Text>
                </TouchableOpacity>
            </View>
        )}
    </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardsContainer:{
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
        
    },
    card:{
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        margin: 30,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    avatar:{
        flex:1,
        height: 300
    },
    footer:{
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio:{
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    logo:{
        marginTop: 30
    },
    buttonsContainer:{
        flexDirection: 'row',
        marginBottom: 30
    },
    button:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset:{
            width: 0,
            height: 2
        }
    },
    empty:{
        alignSelf: "center",
        color: '#999',
        fontSize: 24,
        fontWeight: "bold"
    },
    matchContainer:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    matchAvatar:{
        width:160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30
    },
    matchName:{
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF'
    },
    matchImage:{
        height: 60,
        resizeMode: 'contain'
    },
    matchBio:{
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    closeMatch:{
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }
})