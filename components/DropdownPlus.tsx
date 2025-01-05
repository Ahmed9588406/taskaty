import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View, Modal, Button, Text } from "react-native";
import { router, useRouter } from 'expo-router';

const DropdownPlus = () => {

    const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigateToPage = () => {
    closeMenu();
  };

    return (
        <View>
             <TouchableOpacity onPress={openMenu} style={{backgroundColor: '##0000FF',
                    padding: 10,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <Modal visible={visible} transparent={true} animationType="slide">
            <TouchableOpacity 
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} 
              activeOpacity={1} 
              onPress={closeMenu}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                    <Button title="Create a board" onPress={() => {router.push('/(authenticated)/(tabs)/boards/new-board'); closeMenu()}} />
                    <Button title="Create a Card" onPress={() => {router.push('/(authenticated)/(tabs)/card'); closeMenu()}} />
                    {/*<Button title="Browse Templates" onPress={() => {router.push('/(authenticated)/(tabs)/boards/templates'); closeMenu()}}/>*/}
                    <Button title="Close" onPress={closeMenu} />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        
    )

    
}


export default DropdownPlus