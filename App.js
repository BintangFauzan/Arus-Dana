import { useEffect } from "react";
import { Alert } from "react-native";
import * as Updates from "expo-updates";
import TabunganProvider from "./src/context/TabunganContext";
import AppNavigator from "./src/navigation/AppNavigator";
import BoilerPlate from "./src/screen/BoilerPlate"

export default function App() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) {
      return;
    }

    let isMounted = true;

    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (!update.isAvailable) {
          return;
        }

        const result = await Updates.fetchUpdateAsync();
        if (!result.isNew || !isMounted) {
          return;
        }

        Alert.alert(
          "Pembaruan tersedia",
          "Versi baru sudah diunduh. Mulai ulang aplikasi untuk menggunakannya.",
          [
            { text: "Nanti", style: "cancel" },
            {
              text: "Perbarui sekarang",
              onPress: () => {
                void Updates.reloadAsync().catch((error) => {
                  console.warn("Gagal menerapkan pembaruan aplikasi:", error);
                });
              },
            },
          ],
        );
      } catch (error) {
        console.warn("Gagal memeriksa atau mengunduh pembaruan aplikasi:", error);
      }
    };

    void checkForUpdates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
    <TabunganProvider>
      <AppNavigator/>
    </TabunganProvider>
    </>
  );
}
