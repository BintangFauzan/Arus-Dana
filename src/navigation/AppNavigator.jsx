import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BoilerPlate from "../screen/BoilerPlate";
import AiScreen from "../screen/AiScreen";
import SettingsScreen from "../screen/SettingsScreen"; // Added new screen

const Stack = createNativeStackNavigator();

export default function AppNavigator(){
    return(
        <>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Beranda" component={BoilerPlate}/>
                <Stack.Screen name="AiScreen" component={AiScreen}/>
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </>
    )
}