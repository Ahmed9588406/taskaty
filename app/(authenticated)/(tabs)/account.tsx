import {View, Text, Button} from "react-native";
import { useAuth } from "@clerk/clerk-expo";

const Page = () => {
    const {signOut} = useAuth()
    return (
        <View>
            <Button title="Sign out" onPress={() => signOut()} />
        </View>
    )
}

export default Page