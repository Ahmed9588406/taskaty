import { useSupabase } from '@/context/SupabaseContext';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import { Board } from '@/types/enums';
import {BlurView} from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/elements'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


const Page = () => {
    const {id,bg} = useLocalSearchParams<{id:string, bg?:string}>();
    const {getBoardInfo} = useSupabase();
    const [board, setBoard] = useState<Board>();
    const {top} = useSafeAreaInsets()
    const headerHeight = useHeaderHeight()
    const router = useRouter()
    useEffect(() => {
        if(!id) return;
        loadBoardInfo();
    }, [id]);

    const loadBoardInfo = async () => {
        const data = await getBoardInfo!(id!);
        console.log(data)
        setBoard(data);
    }

    const CustomHeader =() => (
        <BlurView intensity={80} tint={'dark'}  style={{paddingTop:top}}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={()=>router.dismiss()}>
                    <Ionicons name='close' size={24} color={Colors.fontLight} />
                </TouchableOpacity>

                <View style={{flex:1}}>
                    <Text style={{color:Colors.fontLight, fontSize:16}}>{board?.title}</Text>
                    <Text style={{color:Colors.fontLight}}>Workspace of {board?.users.first_name}</Text>
                </View>
                <View style={{flexDirection:'row',gap:14}}>
                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name='filter-circle-outline' size={26} color={Colors.fontLight} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        router.navigate("/(authenticated)/(tabs)/notifications")
                    }}>
                        <Ionicons name='notifications' size={26} color={Colors.fontLight} />
                    </TouchableOpacity>
                    <Link href={"/(authenticated)/(tabs)/account"} asChild>
                    <TouchableOpacity >
                        <MaterialCommunityIcons name='dots-horizontal' size={26} color={Colors.fontLight} />
                    </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </BlurView>
    )
  return (
    <View
    style={{
        backgroundColor: bg,
        flex:1,
        paddingTop: headerHeight,
    }}>
        
    <Stack.Screen
      options={{
        title: board?.title,
        headerTitleAlign: 'center',
        headerTransparent:true,
        header:CustomHeader
      }} 
      />
      <Text>Boards carousel</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap: 14,
        paddingHorizontal:14,
        height: 50
    }
})

export default Page