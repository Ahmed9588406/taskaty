import { Text, View, StyleSheet, Image ,TouchableOpacity} from "react-native";
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalType } from "@/types/enums";
import { useCallback, useMemo, useRef, useState } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AuthModal from '@/components/AuthModal';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
export default function Index() {
  const { top } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['33%'], []);
  const [authType, setAuthType] = useState<ModalType | null>(null);
  

  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModalRef.current?.present();
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
    <BottomSheetModalProvider>    <View style={[styles.container,
       {
       paddingTop: top + 30, 
       },
       ]}>
        <Image source={require('@/assets/images/login/trello.png')} style={styles.image} />
      <Text style={styles.introText}>Move teamwork forward</Text>

      <View style={styles.bottomContainer}>
      <TouchableOpacity
            style={[styles.btn, { backgroundColor: 'white' }]}
            onPress={()=>showModal(ModalType.Login)}>
            <Text style={[styles.btnText, { color: Colors.primary }]}>تسجيل الدخول</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={() => showModal(ModalType.SignUp)}>
            <Text style={[styles.btnText, { color: '#fff' }]}
            >تسجيل مستخدم جديد</Text>
          </TouchableOpacity>
      </View>
    </View>
    <BottomSheetModal
    ref={bottomSheetModalRef}
    index={0}
    backdropComponent={renderBackdrop}
    snapPoints={snapPoints}
    handleComponent={null}
    enableOverDrag={false}
    enablePanDownToClose
    >
      <AuthModal authType={authType}/>
    </BottomSheetModal>
    </BottomSheetModalProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    fontWeight: '600',
    color: 'white',
    fontSize: 17,
    padding: 30,
    textAlign: 'center',
  },
  image: {
    height: 450,
    paddingHorizontal: 40,
    resizeMode: 'contain',
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 40,
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  btnText: {
    fontSize: 18,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    marginHorizontal: 60,
  },
  link: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
