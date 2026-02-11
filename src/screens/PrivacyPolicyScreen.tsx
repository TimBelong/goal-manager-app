import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, fontSize, borderRadius, shadow } from '../theme/styles';

const BackIcon = ({ color }: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
);

const SectionIcon = ({ color }: { color: string }) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 16v-4M12 8h.01" />
    </Svg>
);

const BulletPoint = ({ color }: { color: string }) => (
    <View style={[styles.bullet, { backgroundColor: color }]} />
);

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    icon?: boolean;
}

export function PrivacyPolicyScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const SectionCard = ({ title, children, icon = false }: SectionCardProps) => (
        <View style={[styles.card, shadow.sm, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
            <View style={styles.cardHeader}>
                {icon && <SectionIcon color={colors.accentPrimary} />}
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{title}</Text>
            </View>
            <View style={styles.cardContent}>
                {children}
            </View>
        </View>
    );

    const ListItem = ({ children }: { children: React.ReactNode }) => (
        <View style={styles.listItemContainer}>
            <BulletPoint color={colors.accentPrimary} />
            <Text style={[styles.listItemText, { color: colors.textSecondary }]}>{children}</Text>
        </View>
    );

    const Paragraph = ({ children, style }: { children: React.ReactNode; style?: any }) => (
        <Text style={[styles.paragraph, { color: colors.textSecondary }, style]}>{children}</Text>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
            <StatusBar barStyle={colors.bgPrimary === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, { backgroundColor: colors.bgSecondary }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <BackIcon color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.introContainer}>
                    <Text style={[styles.lastUpdated, { color: colors.accentPrimary, backgroundColor: colors.accentPrimary + '15' }]}>
                        Updated: February 8th, 2026
                    </Text>
                    <Text style={[styles.introText, { color: colors.textPrimary }]}>
                        Goals Track is committed to protecting your privacy. This policy explains our practices regarding your personal data.
                    </Text>
                </View>

                <SectionCard title="Definitions" icon>
                    <Paragraph>Key terms used in this policy:</Paragraph>
                    <ListItem><Text style={{ fontWeight: '700', color: colors.textPrimary }}>Cookie:</Text> Small data saved by your browser for identification and analytics.</ListItem>
                    <ListItem><Text style={{ fontWeight: '700', color: colors.textPrimary }}>Company:</Text> Goals Track ("we", "us").</ListItem>
                    <ListItem><Text style={{ fontWeight: '700', color: colors.textPrimary }}>Country:</Text> Czech Republic.</ListItem>
                    <ListItem><Text style={{ fontWeight: '700', color: colors.textPrimary }}>Personal Data:</Text> Any info that identifies a natural person.</ListItem>
                    <ListItem><Text style={{ fontWeight: '700', color: colors.textPrimary }}>Service:</Text> The Goals Track application.</ListItem>
                </SectionCard>

                <SectionCard title="Information Collection">
                    <Paragraph>We collect information when you use our app, register, or contact us.</Paragraph>
                    <Text style={[styles.subHeader, { color: colors.textPrimary }]}>Collected Data:</Text>
                    <ListItem>Name / Username</ListItem>
                    <ListItem>Email Addresses</ListItem>
                    <ListItem>Password</ListItem>
                    <Paragraph style={{ marginTop: spacing.md }}>
                        End User Data is collected to provide services. We may also collect publicly available info from social media if you link accounts.
                    </Paragraph>
                </SectionCard>

                <SectionCard title="How We Use Information">
                    <ListItem>To personalize your experience.</ListItem>
                    <ListItem>To improve our app and customer service.</ListItem>
                    <ListItem>To process transactions.</ListItem>
                    <ListItem>To send periodic emails (you can opt-out anytime).</ListItem>
                </SectionCard>

                <SectionCard title="Data Protection & Retention">
                    <Paragraph>
                        We implement security measures like SSL encryption to protect your data. Your private transaction info is never kept on file.
                    </Paragraph>
                    <Paragraph style={{ marginTop: spacing.md }}>
                        <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Retention:</Text> We keep info only as long as needed to provide the service. When no longer needed, it is removed or depersonalized.
                    </Paragraph>
                    <Paragraph style={{ marginTop: spacing.md }}>
                        <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Update/Delete:</Text> You can contact us to update, correct, or delete your data by cancelling your account.
                    </Paragraph>
                </SectionCard>

                <SectionCard title="Third Parties & Sharing">
                    <Paragraph>
                        We may share info with trusted third parties for hosting, maintenance, analytics, and marketing. We do not sell your Personal Information.
                    </Paragraph>
                    <Paragraph style={{ marginTop: spacing.md }}>
                        We reserve the right to transfer info in the event of a sale, merger, or transfer of assets.
                    </Paragraph>
                </SectionCard>

                <SectionCard title="Legal Compliance (GDPR & CCPA)">
                    <Text style={[styles.subHeader, { color: colors.textPrimary }]}>GDPR (EEA Users)</Text>
                    <Paragraph>
                        We comply with GDPR principles. You have rights to access, update, and delete your data.
                    </Paragraph>

                    <Text style={[styles.subHeader, { color: colors.textPrimary, marginTop: spacing.md }]}>California Residents (CCPA/CalOPPA)</Text>
                    <Paragraph>
                        You have the right to know what data we collect, request deletion, and not be discriminated against.
                    </Paragraph>
                </SectionCard>

                <SectionCard title="Contact Us">
                    <Paragraph>If you have any questions, please contact us:</Paragraph>
                    <ListItem>Email: mrbelongtim@gmail.com</ListItem>
                </SectionCard>

                <Text style={[styles.footerText, { color: colors.textMuted }]}>
                    Goals Track © 2026
                </Text>
                <View style={styles.footerSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: '700',
    },
    scrollContent: {
        padding: spacing.lg,
    },
    introContainer: {
        marginBottom: spacing.xl,
        alignItems: 'flex-start',
    },
    lastUpdated: {
        fontSize: fontSize.xs,
        fontWeight: '600',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    introText: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        lineHeight: 28,
    },
    card: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    cardTitle: {
        fontSize: fontSize.md,
        fontWeight: '700',
    },
    cardContent: {
        gap: spacing.sm,
    },
    subHeader: {
        fontSize: fontSize.sm,
        fontWeight: '700',
        marginTop: spacing.xs,
        marginBottom: spacing.xs,
    },
    paragraph: {
        fontSize: fontSize.sm,
        lineHeight: 22,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        marginBottom: spacing.xs,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 8,
    },
    listItemText: {
        flex: 1,
        fontSize: fontSize.sm,
        lineHeight: 22,
    },
    footerText: {
        textAlign: 'center',
        fontSize: fontSize.xs,
        marginTop: spacing.lg,
    },
    footerSpacer: {
        height: spacing.xxxl,
    },
});
