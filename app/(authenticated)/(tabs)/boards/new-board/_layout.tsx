import {Stack, useRouter} from 'expo-router'
import { DefaultTheme } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
const Layout = () => {
  const router = useRouter()
  return (<Stack>
    <Stack.Screen name='index' options={{
      title:'Board',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: DefaultTheme.colors.background
      },
      headerLeft: ()=> (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='close' size={26} color={Colors.primary} />
        </TouchableOpacity>
      )
    }} />

    <Stack.Screen name='color-select' options={{title: 'Select a color'}} />
  </Stack>
  )
}
export default Layout