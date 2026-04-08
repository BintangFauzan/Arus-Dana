import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BoilerPlate from "../screen/BoilerPlate"
import AiScreen from "../screen/AiScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator(){
    
    return(
        <>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Beranda" component={BoilerPlate}/>
                <Stack.Screen name="AiScreen" component={AiScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
        </>
    )
}
