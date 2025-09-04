# Contributing to Marketplace App

## Theme System

This project uses a standardized theme system that combines Chakra UI with Emotion styled components.

### Theme Structure

All theme files are located in `src/theme/` and follow a consistent namespaced pattern:

```
src/theme/
├── index.js          # Main theme configuration
├── colors.js         # Color palette
├── layout.js         # Spacing, shadows, borderRadius
├── mixins.js         # Reusable CSS mixins
├── zIndices.js       # Z-index values for layering
└── mediaQueries.js   # Responsive breakpoints
```

### Theme Usage

#### Emotion Styled Components
```jsx
import styled from "@emotion/styled"

const StyledComponent = styled.div`
  color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.layout.spacing.lg};
  border-radius: ${({theme}) => theme.layout.borderRadius.md};
  box-shadow: ${({theme}) => theme.layout.shadows.lg};
  z-index: ${({theme}) => theme.zIndices.modal};
  
  ${({theme}) => theme.mediaQueries.md} {
    padding: ${({theme}) => theme.layout.spacing.xl};
  }
  
  ${({theme}) => theme.mixins.flexCenter};
`;
```

#### Chakra UI with Emotion Wrapper
```jsx
import styled from "@emotion/styled"
import { Button } from "@chakra-ui/react"

const CustomButton = styled(Button)`
  background: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.layout.borderRadius.lg};
  
  &:hover {
    background: ${({theme}) => theme.colors.secondary};
    box-shadow: ${({theme}) => theme.layout.shadows.lg};
  }
`;
```

### Adding New Theme Files

1. **Create the theme file** in `src/theme/` with a descriptive name
2. **Export a default object** with your theme values:
   ```js
   // src/theme/typography.js
   const typography = {
     fontSizes: {
       xs: "0.75rem",
       sm: "0.875rem",
       md: "1rem",
       lg: "1.125rem",
       xl: "1.25rem",
     },
     fontWeights: {
       normal: 400,
       medium: 500,
       bold: 700,
     },
   }
   
   export default typography
   ```

3. **Import and add to theme** in `src/theme/index.js`:
   ```js
   import typography from "./typography"
   
   export const emotionTheme = {
     colors,
     layout,
     mixins,
     zIndices,
     mediaQueries,
     typography, // Add your new theme file
   }
   ```

4. **Use the namespaced pattern** in components:
   ```jsx
   font-size: ${({theme}) => theme.typography.fontSizes.lg};
   font-weight: ${({theme}) => theme.typography.fontWeights.bold};
   ```

### Theme Conventions

- **Namespaced Access**: Always use `theme.[filename].[property]` pattern
- **Consistent Naming**: Use descriptive file names that match their content
- **Default Exports**: Each theme file should export a single default object
- **No Spreading**: Keep theme properties namespaced for clarity and maintainability

### File Structure Guidelines

- **colors.js**: Color palette (primary, secondary, background, etc.)
- **layout.js**: Layout-related properties (spacing, shadows, borderRadius)
- **mixins.js**: Reusable CSS patterns and utilities
- **zIndices.js**: Z-index values for proper layering
- **mediaQueries.js**: Responsive breakpoints and media queries

### Development Workflow

1. Make theme changes in the appropriate theme file
2. Test changes in components using the namespaced pattern
3. Ensure consistency across all theme usage
4. Update this documentation if adding new theme categories

## Code Style

- Use consistent indentation (2 spaces)
- Follow the established theme naming conventions
- Keep theme files focused on their specific domain
- Document any complex theme logic with comments
