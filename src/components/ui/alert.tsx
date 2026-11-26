import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import AlertCircle from "lucide-react-native/icons/alert-circle";
import CheckCircle2 from "lucide-react-native/icons/check-circle-2";
import Info from "lucide-react-native/icons/info";
import X from "lucide-react-native/icons/x";
import { radius } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

const alertVariants = {
  success: {
    container: "bg-success-bg dark:bg-success-bg-dark",
    tone: "success" as const,
    icon: CheckCircle2,
  },
  info: {
    container: "bg-badge-info-bg dark:bg-badge-info-bg-dark",
    tone: "info" as const,
    icon: Info,
  },
  error: {
    container: "bg-error-bg dark:bg-error-bg-dark",
    tone: "error" as const,
    icon: AlertCircle,
  },
} as const;

export type AlertVariant = keyof typeof alertVariants;

export interface AlertProps {
  variant?: AlertVariant;
  message: string;
  onDismiss?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Inline status banner for confirmation and error feedback.
 */
export function Alert({
  variant = "success",
  message,
  onDismiss,
  className,
  style,
}: AlertProps) {
  const config = alertVariants[variant];

  return (
    <View
      accessibilityRole="alert"
      className={[
        "flex-row items-center gap-md rounded-lg px-base py-md",
        config.container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[
        {
          borderRadius: radius.lg,
          borderCurve: "continuous",
        },
        style,
      ]}
    >
      <AppIcon icon={config.icon} size="md" tone={config.tone} />
      <AppText
        variant="caption"
        tone={config.tone}
        className="flex-1 font-sans-medium"
      >
        {message}
      </AppText>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss alert"
          onPress={onDismiss}
          hitSlop={8}
          className="items-center justify-center p-xs"
        >
          <AppIcon icon={X} size="sm" tone={config.tone} />
        </Pressable>
      ) : null}
    </View>
  );
}
