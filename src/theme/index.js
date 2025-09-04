// Theme configuration that works with both Chakra UI and Emotion
import { createSystem, defaultConfig } from "@chakra-ui/react"
import colors from "./colors"
import layout from "./layout"
import mixins from "./mixins"
import zIndices from "./zIndices"
import mediaQueries from "./mediaQueries"
import fonts from "./fonts"

// Create a custom Chakra system
export const system = createSystem(defaultConfig);

// Emotion theme that can access Chakra tokens
export const emotionTheme = {
  colors,
  layout,
  mixins,
  zIndices,
  mediaQueries,
  fonts,
}
