import { useState, type ReactNode } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { cubicBezier, useReducedMotion } from "react-native-reanimated";

const CSS_EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

export interface PressableScaleProps extends Omit<PressableProps, "style" | "children"> {
  children: ReactNode;
  pressedScale?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pressable wrapper applying a 120ms UI-thread scale feedback transition
 * following Roam's motion spec and respecting system Reduced Motion.
 */
export function PressableScale({
  children,
  pressedScale = 0.97,
  className,
  style,
  onPressIn,
  onPressOut,
  pressRetentionOffset = 16,
  ...props
}: PressableScaleProps) {
  const reducedMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      pressRetentionOffset={pressRetentionOffset}
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      {...props}
    >
      <Animated.View
        className={className}
        style={[
          {
            transform: [{ scale: !reducedMotion && pressed ? pressedScale : 1 }],
            transitionProperty: "transform",
            transitionDuration: reducedMotion ? 0 : 120,
            transitionTimingFunction: CSS_EASE_OUT,
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
