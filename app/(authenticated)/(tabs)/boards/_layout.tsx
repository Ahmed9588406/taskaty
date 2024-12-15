import DropdownPlus from '@/components/DropdownPlus';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';

const Layout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitle: () => (
            <Image
              style={{ width: 120, height: 50, resizeMode: 'contain' }}
              source={require('@/assets/images/trello-logo-gradient-white.png')}
            />
          ),
          headerRight:() => <DropdownPlus />
        }}
      />
     </Stack>
  );
};
export default Layout;