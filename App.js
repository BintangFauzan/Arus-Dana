import TabunganProvider from "./src/context/TabunganContext";
import AppNavigator from "./src/navigation/AppNavigator";
import BoilerPlate from "./src/screen/BoilerPlate"

export default function App() {
  return (
    <>
    <TabunganProvider>
      <AppNavigator/>
    </TabunganProvider>
    </>
  );
}
