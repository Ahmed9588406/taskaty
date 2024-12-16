import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const COLORS = [
  { hex: '#FF0000', label: 'هام وعاجل' },
  { hex: '#d29034', label: 'هام' },
  { hex: '#519839', label: 'هام وغير عاجل' },
  { hex: '#b04632', label: 'عادي' },
  { hex: '#89609e', label: 'السرعة' },
  { hex: '#cd5a91', label: 'خاص' },
  { hex: '#4bbf6b', label: 'عاجل وغير هام' },
  { hex: '#00aecc', label: 'غير هام وغير عاجل' },
  { hex: '#838c91', label: 'مهم جدا' },
];

export const DEFAULT_COLOR = COLORS[0].hex;

const Page = () => {
  const [selected, setSelected] = useState<string>(DEFAULT_COLOR);
  const router = useRouter();

  const onColorSelect = (color: string) => {
    setSelected(color);
    router.setParams({ bg: color });
  };

  return (
    <View style={styles.container}>
      {COLORS.map(({ hex, label }) => (
        <TouchableOpacity
          key={hex}
          style={[
            styles.colorBox,
            {
              backgroundColor: hex,
              borderWidth: selected === hex ? 2 : 0,
            },
          ]}
          onPress={() => onColorSelect(hex)}
        >
          <Text style={styles.colorLabel}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  colorBox: {
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 4,
    borderColor: Colors.fontDark,
    justifyContent: 'center', // Align text at the bottom
    alignItems: 'center',
    position: 'relative',
  },
  colorLabel: {
    color: '#FFFFFF',
    marginTop: 5, // Space between the box and the text
    fontWeight: 'bold',
  },
});

export default Page;
