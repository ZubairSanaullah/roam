import { Text, type TextProps } from "react-native";

const variantClasses = {
  display: "type-display",
  heading: "type-heading",
  title: "type-title",
  body: "type-body",
  caption: "type-caption",
  button: "type-button",
  label: "type-label",
} as const;

const toneClasses = {
  primary: "text-text-primary dark:text-text-primary-dark",
  secondary: "text-text-secondary dark:text-text-secondary-dark",
  inverse: "text-surface-white dark:text-text-primary",
  onAccent: "text-text-primary",
  lavender: "text-lavender-accent dark:text-lavender",
  success: "text-success-fg dark:text-success-fg-dark",
  error: "text-error-fg dark:text-error-fg-dark",
} as const;

export type AppTextVariant = keyof typeof variantClasses;
export type AppTextTone = keyof typeof toneClasses;

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  className?: string;
}

/**
 * Typography primitive backed by the Plus Jakarta Sans type ramp in `global.css`.
 */
export function AppText({
  variant = "body",
  tone = "primary",
  className,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      className={[variantClasses[variant], toneClasses[tone], className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...props}
    />
  );
}
