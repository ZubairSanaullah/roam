import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChevronLeft from "lucide-react-native/icons/chevron-left";
import { Alert, AppText, Button } from "@/components/ui";
import { spacing } from "@/theme";

export interface AuthScreenShellProps {
  title: string;
  subtitle: string;
  notice: string | null;
  noticeVariant?: "info" | "success" | "error";
  onDismissNotice: () => void;
  backAccessibilityLabel?: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerHref?: "/sign-in" | "/sign-up";
  onFooterLinkPress?: () => void;
  children: ReactNode;
}

/**
 * Shared layout shell matching Roam's auth design: left circular back button,
 * right `roam` wordmark, hero title & subtitle, optional alert, content slot,
 * and underlined bottom link.
 */
export function AuthScreenShell({
  title,
  subtitle,
  notice,
  noticeVariant = "info",
  onDismissNotice,
  backAccessibilityLabel = "Go back",
  footerPrompt,
  footerLinkLabel,
  footerHref,
  onFooterLinkPress,
  children,
}: AuthScreenShellProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-white dark:bg-surface-elevated-dark"
    >
      <StatusBar style="auto" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow px-xl"
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            iconOnly
            leftIcon={ChevronLeft}
            accessibilityLabel={backAccessibilityLabel}
            onPress={handleBack}
          />
          <AppText variant="brand">roam</AppText>
        </View>

        <View className="mt-xl gap-sm">
          <AppText variant="hero" className="pb-xs">
            {title}
          </AppText>
          <AppText variant="body" tone="secondary">
            {subtitle}
          </AppText>
        </View>

        {notice ? (
          <Alert
            variant={noticeVariant}
            message={notice}
            onDismiss={onDismissNotice}
            className="mt-base"
          />
        ) : null}

        {children}

        <View className="mt-auto flex-row items-center justify-center gap-xs pt-xl">
          <AppText variant="caption" tone="secondary">
            {footerPrompt}
          </AppText>
          {footerHref ? (
            <Link href={footerHref} replace asChild>
              <Pressable hitSlop={8} accessibilityRole="link">
                <AppText variant="caption" tone="primary" className="font-sans-bold underline">
                  {footerLinkLabel}
                </AppText>
              </Pressable>
            </Link>
          ) : (
            <Pressable hitSlop={8} accessibilityRole="button" onPress={onFooterLinkPress}>
              <AppText variant="caption" tone="primary" className="font-sans-bold underline">
                {footerLinkLabel}
              </AppText>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
