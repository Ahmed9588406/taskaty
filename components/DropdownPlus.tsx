import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function DropdownPlus() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View>
            <TouchableOpacity style={styles.plusButton} onPress={() => setIsOpen(!isOpen)}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            {/* Rest of the component */}
        </View>
    );
}

const styles = StyleSheet.create({
    plusButton: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
});

export default DropdownPlus;
