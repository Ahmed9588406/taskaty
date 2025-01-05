import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useState, useContext, useCallback } from 'react';
import { SupabaseContext } from '../../../context/SupabaseContext';
import debounce from 'lodash.debounce';

interface User {
  id: string;
  email: string;
  full_name: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(SupabaseContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { findUsers } = context;

  const searchUsers = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await findUsers(query);
      setUsers(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchUsers(query), 300),
    [searchUsers]
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.full_name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading && <Text>Loading...</Text>}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Page;