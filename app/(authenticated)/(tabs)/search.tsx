import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';  // Changed imports
import { SupabaseContext } from '../../../context/SupabaseContext';
import { Avatar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  email: string;
  full_name: string; // This will now contain just first_name from Supabase
  username: string;
  avatar_url?: string;
  isClerkUser?: boolean;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const context = useContext(SupabaseContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { findUsers } = context;

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await findUsers(query);
      setUsers(data || []);
    } catch (error) {
      setError('Failed to search users');
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery) {
      timeoutRef.current = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
    } else {
      setUsers([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Avatar
        size={50}
        rounded
        title={getInitials(item.full_name)}
        source={item.avatar_url ? { uri: item.avatar_url } : undefined}
        containerStyle={[
          styles.avatar,
          item.isClerkUser ? styles.clerkAvatar : styles.supabaseAvatar
        ]}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.full_name}</Text>
        <Text style={styles.userIdentifier}>
          {item.username ? `@${item.username}` : item.email}
        </Text>
        <Text style={styles.userSource}>
          {item.isClerkUser ? 'Clerk User' : 'Supabase User'}
        </Text>
      </View>
    </View>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>
        {searchQuery ? 'No users found' : 'Start typing to search users'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, username, or email..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2089dc',
  },
  clerkAvatar: {
    backgroundColor: '#7559FF', // Clerk's brand color
  },
  supabaseAvatar: {
    backgroundColor: '#3ECF8E', // Supabase's brand color
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userIdentifier: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userSource: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Page;