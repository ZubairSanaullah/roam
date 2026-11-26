import Svg, { Path } from "react-native-svg";
import { iconSizes, palette } from "@/theme";

export interface GoogleIconProps {
  size?: number;
}

/**
 * Multi-color Google "G" vector icon for Continue with Google buttons.
 */
export function GoogleIcon({ size = iconSizes.md }: GoogleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="Google">
      <Path
        fill={palette.googleBlue}
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65Z"
      />
      <Path
        fill={palette.googleGreen}
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <Path
        fill={palette.googleYellow}
        d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29V6.61H1.28A12 12 0 0 0 0 12c0 1.93.46 3.76 1.28 5.39l4-3.1Z"
      />
      <Path
        fill={palette.googleRed}
        d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l4 3.1C6.23 6.87 8.88 4.76 12 4.76Z"
      />
    </Svg>
  );
}
