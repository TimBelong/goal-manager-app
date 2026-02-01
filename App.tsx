import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { GoalsProvider } from './src/contexts/GoalsContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initI18n } from './src/i18n';

function AppContent() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgPrimary}
      />
      <RootNavigator />
    </>
  );
}

function App(): React.JSX.Element {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nInitialized(true));
  }, []);

  if (!isI18nInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureHandlerRoot}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <GoalsProvider>
                <AppContent />
              </GoalsProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureHandlerRoot: {
    flex: 1,
  },
});

export default App;
