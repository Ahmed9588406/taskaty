import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View, Modal, Button } from "react-native";
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                <Button title="Create a board" onPress={() => {router.push('/(authenticated)/(tabs)/boards/new-board'); closeMenu()}} />
                <Button title="Create a Card" onPress={() => {router.push('/(authenticated)/(tabs)/my-cards'); closeMenu()}} />
                <Button title="Browse Templates" onPress={() => {router.push('/(authenticated)/(tabs)/boards/templates'); closeMenu()}}/>
                <Button title="Close" onPress={closeMenu} />
              </View>
            </View>
          </Modal>
        </View>
        
    )

    
}


export default DropdownPlus