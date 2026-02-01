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

const SunIcon = ({ size = 16, color = '#8b5cf6' }: { size?: number; color?: string }) => (
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

const MoonIcon = ({ size = 16, color = '#8b5cf6' }: { size?: number; color?: string }) => (
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

const LanguageIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const ThemeIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="5" />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
  </Svg>
);

const UserIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const InfoIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4M12 8h.01" />
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

const LogoutIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
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
    { value: 'light', label: t('settings.themeLight'), icon: <SunIcon size={16} color={colors.textSecondary} /> },
    { value: 'dark', label: t('settings.themeDark'), icon: <MoonIcon size={16} color={colors.textSecondary} /> },
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

        {/* Account Block */}
        {user && (
          <View style={[styles.settingsBlock, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
             <View style={styles.accountContent}>
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
           
          </View>
        )}

        {/* Language Block */}
        <View style={[styles.settingsBlock, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIcon, { backgroundColor: colors.bgTertiary }]}>
              <LanguageIcon color={colors.textSecondary} />
            </View>
            <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
              {t('settings.language')}
            </Text>
          </View>
          <Select
            value={language}
            options={languageOptions}
            onChange={(value) => changeLanguage(value as typeof language)}
            containerStyle={styles.selectContainer}
          />
        </View>

        {/* Theme Block */}
        <View style={[styles.settingsBlock, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIcon, { backgroundColor: colors.bgTertiary }]}>
              <ThemeIcon color={colors.textSecondary} />
            </View>
            <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
              {t('settings.theme')}
            </Text>
          </View>
          <Select
            value={isDark ? 'dark' : 'light'}
            options={themeOptions}
            onChange={(value) => setTheme(value as 'light' | 'dark')}
            containerStyle={styles.selectContainer}
          />
        </View>

        {/* Version Block */}
        <View style={[styles.settingsBlock, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIcon, { backgroundColor: colors.bgTertiary }]}>
              <InfoIcon color={colors.textSecondary} />
            </View>
            <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
              {t('settings.version')}
            </Text>
          </View>
          <View style={styles.versionContent}>
            <Text style={[styles.versionValue, { color: colors.textSecondary }]}>
              1.0.0
            </Text>
          </View>
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
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  settingsBlock: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  blockIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: fontSize.xs,
  },
  selectContainer: {
    marginBottom: 0,
  },
  versionContent: {
    paddingTop: spacing.xs,
  },
  versionValue: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  flagIcon: {
    width: 20,
    height: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    marginTop: spacing.lg,
  },
  logoutText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
