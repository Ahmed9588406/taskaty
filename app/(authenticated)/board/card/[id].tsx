import { useSupabase } from '@/context/SupabaseContext';
import { Board, Task, User } from '@/types/enums';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  FlatList,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { DefaultTheme } from '@react-navigation/native';
import UserListItem from '@/components/UserListItem';
import React from 'react';
import Toast from 'react-native-toast-message';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const supabase = useSupabase();
  if (!supabase) {
    throw new Error('Supabase context is not available');
  }
  const { getCardInfo, getFileFromPath, updateCard, assignCard, findUsers } = supabase;

  const router = useRouter();
  const [card, setCard] = useState<Task>();
  const [users, setUsers] = useState<User[]>([]);
  const [imagePath, setImagePath] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState('');

  if (card?.image_url) {
    getFileFromPath!(card.image_url).then((path) => {
      if (path) {
        setImagePath(path);
      }
    });
  }

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, [id]);

  const loadInfo = async () => {
    if (!id) return;

    const data = await getCardInfo!(id);
    console.log('🚀 ~ loadInfo ~ cardData:', data);
    setCard(data);

    const userData = await findUsers!('');
    setUsers(userData.filter(Boolean));
  };

  const saveAndClose = () => {
    updateCard!(card!);
    router.back();
  };

  const onArchiveCard = () => {
    updateCard!({ ...card!, done: true });
    router.back();
  };

  const onAssignUser = async (user: User) => {
    const { data, error } = await assignCard!(card!.id, user.id);

    setCard(data);
    bottomSheetModalRef.current?.close();
  };

  const handleSaveDescription = async () => {
    try {
      if (!card) return;
      
      await updateCard!({
        ...card,
        description: tempDescription
      });
      
      setCard({ ...card, description: tempDescription });
      setIsEditing(false);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Description saved successfully',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save description',
        position: 'bottom',
      });
    }
  };

  const saveDescription = async () => {
    try {
      if (!card) return;
      
      const { data, error } = await updateCard!({
        ...card,
        description: card.description
      });
      
      if (error) throw error;
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Description saved successfully',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save description',
        position: 'bottom',
      });
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={saveAndClose}>
                <Ionicons name="close" size={24} color={Colors.grey} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={saveDescription} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ),
          }}
        />
        {card && (
          <>
            {!card.image_url && (
              <TextInput
                style={styles.input}
                value={card.title}
                multiline
                onChangeText={(text: string) => setCard({ ...card, title: text })}></TextInput>
            )}

            <View style={styles.descriptionContainer}>
              <TextInput
                style={[styles.input, { minHeight: 100 }]}
                value={isEditing ? tempDescription : card.description || ''}
                multiline
                placeholder="Add a description"
                onChangeText={(text: string) => setTempDescription(text)}
                onFocus={() => {
                  setIsEditing(true);
                  setTempDescription(card.description || '');
                }}
              />
              {isEditing && (
                <View style={styles.descriptionButtons}>
                  <TouchableOpacity 
                    style={[styles.descButton, styles.saveButton]} 
                    onPress={handleSaveDescription}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.descButton, styles.cancelButton]}
                    onPress={() => {
                      setIsEditing(false);
                      setTempDescription('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {imagePath && (
              <>
                {card.image_url && (
                  <Image
                    source={{ uri: imagePath }}
                    style={{
                      width: '100%',
                      height: 400,
                      resizeMode: 'contain',
                      borderRadius: 4,
                      backgroundColor: '#f3f3f3',
                    }}
                  />
                )}
              </>
            )}

            <View style={styles.memberContainer}>
              <Ionicons name="person" size={24} color={Colors.grey} />

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => bottomSheetModalRef.current?.present()}>
                {!card.assigned_to ? (
                  <Text>Assign...</Text>
                ) : (
                  <Text>Assigned to {card.users?.first_name || card.users?.email}</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onArchiveCard} style={styles.btn}>
              <Text style={styles.btnText}>Archive</Text>
            </TouchableOpacity>
          </>
        )}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleStyle={{ backgroundColor: DefaultTheme.colors.background, borderRadius: 12 }}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          enablePanDownToClose>
          <View style={styles.bottomContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
              <Button title="Cancel" onPress={() => bottomSheetModalRef.current?.close()} />
            </View>
            <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8 }}>
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(props) => (
                  <UserListItem element={props} onPress={onAssignUser} />
                )}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
          </View>
        </BottomSheetModal>
        <Toast />
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginVertical: 8,
  },
  memberContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 8,
    alignItems: 'center',
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  bottomContainer: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  descButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: Colors.grey,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
export default Page;