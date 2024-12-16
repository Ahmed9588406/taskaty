import { useSupabase } from '@/context/SupabaseContext';
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native'
import { Board } from '@/types/enums';

const Page = () => {
    const {id} = useLocalSearchParams<{id:string}>();
    const {getBoardInfo} = useSupabase();
    const [board, setBoard] = useState<Board>();
    useEffect(() => {
        if(!id) return;
        loadBoardInfo();
    }, [id]);

    const loadBoardInfo = async () => {
        const data = await getBoardInfo!(id!);
        console.log(data)
        setBoard(data);
    }
  return (
    <View
    style={{
        backgroundColor: board?.background,
        flex:1,
    }}
        >
      <Text>Page</Text>
    </View>
  )
}

export default Page