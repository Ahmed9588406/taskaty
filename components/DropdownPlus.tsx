import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import DropdownMenu from "@zeego/dropdown-menu";

const DropdownPlus = () => {
  const [visible, setVisible] = useState(false);

  // Options to display in the dropdown menu
  const options = ["Option 1", "Option 2", "Option 3"];

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleOptionSelect = (option:string) => {
    console.log(`Selected: ${option}`);
    closeMenu();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={openMenu}
        style={{
          backgroundColor: "#0000FF",
          padding: 10,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      {visible && (
        <Modal transparent animationType="fade" visible={visible}>
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  width: 200,
                }}
              >
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleOptionSelect(option)}
                    style={{ paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 18 }}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default DropdownPlus;
