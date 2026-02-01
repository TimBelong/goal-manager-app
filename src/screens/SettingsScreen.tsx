import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Select } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  SUPPORTED_LANGUAGES,
  languageNames,
} from '../i18n';
import { borderRadius, fontSize, spacing } from '../theme/styles';

const SunIcon = ({ size = 28, color = '#8b5cf6' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const MoonIcon = ({ size = 28, color = '#8b5cf6' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RuFlagIcon = () => (
  <Image source={require('../assets/images/ru-flag.png')} style={styles.flagIcon} />
);

const EnFlagIcon = () => (
  <Image source={require('../assets/images/en-flag.png')} style={styles.flagIcon} />  
);

const EsFlagIcon = () => (
  <Image source={require('../assets/images/spain-flag.png')} style={styles.flagIcon} />
);

const ZhFlagIcon = () => (
  <Image source={require('../assets/images/chinese-flag.png')} style={styles.flagIcon} />
);

const ArFlagIcon = () => (
  <Image source={require('../assets/images/arabic-flag.png')} style={styles.flagIcon} />
);

// Logout icon
const LogoutIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export function SettingsScreen() {
  const { t } = useTranslation();
  const { colors, isDark, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { logout, user } = useAuth();

  const languageOptions = SUPPORTED_LANGUAGES.map((lang) => {
    let icon;
    if (lang === 'ru') icon = <RuFlagIcon />;
    else if (lang === 'en') icon = <EnFlagIcon />;
    else if (lang === 'es') icon = <EsFlagIcon />;
    else if (lang === 'zh') icon = <ZhFlagIcon />;
    else if (lang === 'ar') icon = <ArFlagIcon />;
    
    return {
      value: lang,
      label: languageNames[lang],
      icon,
    };
  });

  const themeOptions = [
    { value: 'light', label: t('settings.themeLight'), icon: <SunIcon size={24} /> },
    { value: 'dark', label: t('settings.themeDark'), icon: <MoonIcon size={24} /> },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth={2}>
            <Circle cx="12" cy="12" r="5" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 
            1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 
            1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </Svg>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('settings.title')}
            </Text>
          </View>
        </View>

        {/* Account Info */}
        {user && (
          <View style={[styles.accountCard, { backgroundColor: colors.bgSecondary }]}>
            <View style={[styles.avatar, { backgroundColor: colors.accentPrimary }]}>
              <Text style={styles.avatarText}>
                {user.name
                  ?.split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.textPrimary }]}>
                {user.name}
              </Text>
              <Text style={[styles.accountEmail, { color: colors.textSecondary }]}>
                {user.email}
              </Text>
            </View>
          </View>
        )}

        {/* Settings List */}
        <View style={styles.settingsList}>
          {/* Language */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              {t('settings.language')}
            </Text>
            <Select
              value={language}
              options={languageOptions}
              onChange={(value) => changeLanguage(value as typeof language)}
              containerStyle={styles.selectContainer}
            />
          </View>

          {/* Theme */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              {t('settings.theme')}
            </Text>
            <Select
              value={isDark ? 'dark' : 'light'}
              options={themeOptions}
              onChange={(value) => setTheme(value as 'light' | 'dark')}
              containerStyle={styles.selectContainer}
            />
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionLabel, { color: colors.textMuted }]}>
            {t('settings.version')}
          </Text>
          <Text style={[styles.versionValue, { color: colors.textMuted }]}>
            1.0.0
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.danger }]}
          onPress={logout}
          activeOpacity={0.7}
        >
          <LogoutIcon color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>
            {t('auth.logout')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  flagIcon: {
    width: 24,
    height: 24,
  },

  avatarText: {
    color: '#ffffff',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: fontSize.sm,
  },
  settingsList: {
    marginBottom: spacing.xl,
  },
  settingItem: {
    marginBottom: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  selectContainer: {
    marginBottom: 0,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  versionLabel: {
    fontSize: fontSize.sm,
  },
  versionValue: {
    fontSize: fontSize.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    marginTop: 'auto',
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
