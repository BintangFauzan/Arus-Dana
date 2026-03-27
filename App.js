import TabunganProvider from "./src/context/TabunganContext";
import BoilerPlate from "./src/screen/BoilerPlate"

export default function App() {
  return (
    <>
    <TabunganProvider>
      <BoilerPlate/>
    </TabunganProvider>
    </>
  );
}
