import { useSupabase } from '@/context/SupabaseContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { DefaultTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors'; // Adjust the import path as necessary
import { User } from '@/types/enums';
import { useHeaderHeight } from '@react-navigation/elements';
import UserListItem from '@/components/UserListItem';

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { findUsers, addUserToBoard } = useSupabase();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const headerHeight = useHeaderHeight();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        searchUsers();
      } else {
        setUserList([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await findUsers!(search);
      setUserList(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddUser = async (user: User) => {
    console.log('adding user', user);
    await addUserToBoard!(id!, user.id);
    await router.dismiss();
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userRow}>
      <Image source={{ uri: item.avatar_url }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.first_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.assignButton} onPress={() => onAddUser(item)}>
        <Text style={styles.assignButtonText}>Assign</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
          headerSearchBarOptions: {
            inputType: 'email',
            autoCapitalize: 'none',
            autoFocus: true,
            placeholder: 'Invite by name, username or email',
            cancelButtonText: 'Done',
            onChangeText: (e) => setSearch(e.nativeEvent.text),
            onCancelButtonPress: () => router.dismiss(),
          },
        }}
      />
      <FlatList
        data={userList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderUserItem}
        style={{ marginTop: 60 + headerHeight }}
        contentContainerStyle={{ gap: 8 }}
        ListEmptyComponent={
          search ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              {isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> : 'No users found'}
            </Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: Colors.grey,
  },
  assignButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default Page;