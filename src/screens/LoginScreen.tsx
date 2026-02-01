import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const LogoLight = require('../assets/images/vertical_logo_light.png');
const LogoDark = require('../assets/images/vertical_logo_dark.png');
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import { borderRadius, fontSize, spacing } from '../theme/styles';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!password) {
      newErrors.password = t('auth.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert(
        t('auth.loginError'),
        error instanceof Error ? error.message : t('auth.loginFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={isDark ? LogoDark : LogoLight}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('auth.loginTitle')}
            </Text>
          </View>

          <View
            style={[
              styles.form,
              {
                backgroundColor: colors.bgSecondary,
                borderColor: colors.borderColor,
              },
            ]}
          >
            <Input
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />

            <Button
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            >
              {t('auth.login')}
            </Button>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                {t('auth.noAccount')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.link, { color: colors.accentPrimary }]}>
                  {t('auth.register')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: fontSize.md,
  },
  form: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  footerText: {
    fontSize: fontSize.sm,
  },
  link: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
