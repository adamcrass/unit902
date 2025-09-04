# Contributing to Unit 902

## Development Workflow

### Getting Started

1. **Clone and Setup**

   ```bash
   git clone https://github.com/transpiled/unit902.git
   cd unit902
   yarn
   ```

2. **Development Server**

   ```bash
   yarn dev  # Starts on http://localhost:1027
   ```

3. **Watch Mode Development**

   ```bash
   # Terminal 1: Development server
   yarn dev

   # Terminal 2: Test watch mode
   yarn test:watch

   # Terminal 3: Lint watch mode
   yarn lint:watch
   ```

### Available Scripts

- `yarn dev` - Start development server on port 1027
- `yarn test` - Run tests once
- `yarn test:watch` - Run tests in watch mode (auto-rerun on changes)
- `yarn lint` - Lint code once
- `yarn lint:watch` - Lint code in watch mode (auto-rerun on changes)
- `yarn format` - Format code with Prettier
- `yarn build` - Build for production
- `yarn preview` - Preview production build

### Testing Guidelines

- Tests are located in `src/__test__/`
- Use React Testing Library for component testing
- Jest is configured with Babel for ES6 support
- Write tests for custom hooks (e.g., `useFormatPrice`)
- Aim for meaningful test coverage, not just high percentages

### Code Quality

- ESLint configuration includes Jest environment for test files
- Prettier handles code formatting automatically
- Use watch modes during development for continuous feedback
- All code should pass linting before committing

---

## GitHub CLI Workflow

### Prerequisites

Install GitHub CLI if you haven't already:

```bash
# macOS
brew install gh

# Authenticate with GitHub
gh auth login
```

### Branch Creation and Development

1. **Create a new feature branch:**

   ```bash
   # Create feature branch
   gh issue create --title "Add new feature" --body "Description of the feature"
   gh issue develop <issue-number> --checkout  # Creates branch from issue

   ```

2. **Development workflow:**

   ```bash
   # Make your changes
   # Run tests and linting
   yarn test
   yarn lint
   yarn format

   # Commit changes
   git add .
   git commit -m "feat: add your feature description"

   # Push branch
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request:**

   ```bash
   # Create PR from current branch
   gh pr create --title "Add new feature" --body "Detailed description of changes"

   # Or create PR with template
   gh pr create --web  # Opens browser for PR creation

   # View PR status
   gh pr status

   # View PR in browser
   gh pr view --web
   ```

4. **PR Management:**

   ```bash
   # Check out a PR locally for review
   gh pr checkout <pr-number>

   # Merge PR after approval
   gh pr merge <pr-number> --squash  # or --merge or --rebase

   # Close PR without merging
   gh pr close <pr-number>
   ```

---

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
import styled from "@emotion/styled";

const StyledComponent = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.layout.spacing.lg};
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  box-shadow: ${({ theme }) => theme.layout.shadows.lg};
  z-index: ${({ theme }) => theme.zIndices.modal};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: ${({ theme }) => theme.layout.spacing.xl};
  }

  ${({ theme }) => theme.mixins.flexCenter};
`;
```

#### Chakra UI with Emotion Wrapper

```jsx
import styled from "@emotion/styled";
import { Button } from "@chakra-ui/react";

const CustomButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.layout.borderRadius.lg};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    box-shadow: ${({ theme }) => theme.layout.shadows.lg};
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
   };

   export default typography;
   ```

3. **Import and add to theme** in `src/theme/index.js`:

   ```js
   import typography from "./typography";

   export const emotionTheme = {
     colors,
     layout,
     mixins,
     zIndices,
     mediaQueries,
     typography, // Add your new theme file
   };
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

## Custom Hooks

### useFormatPrice Hook

Location: `src/hooks/useFormatPrice.js`

A custom hook for formatting prices from cents to properly formatted currency:

```jsx
import { useFormatPrice } from "../hooks/useFormatPrice";

const ProductCard = ({ priceInCents }) => {
  const price = useFormatPrice(priceInCents);

  return (
    <div>
      <span>{price.formatted}</span> {/* "$12.99" */}
      <span>Dollars: {price.dollars}</span> {/* 12 */}
      <span>Cents: {price.cents}</span> {/* 99 */}
    </div>
  );
};
```

**Features:**

- Converts cents to formatted currency (e.g., 1299 → "$12.99")
- Supports different currencies and locales
- Handles edge cases (null, undefined, zero)
- Returns object with `formatted`, `dollars`, `cents`, and `raw` values
- Includes utility functions: `dollarsToCents()` and `centsToDollars()`

**Testing:**

- Comprehensive test suite in `src/__test__/useFormatPrice.test.js`
- Tests various scenarios including edge cases and different currencies

## Code Style

- Use consistent indentation (2 spaces)
- Follow the established theme naming conventions
- Keep theme files focused on their specific domain
- Document any complex theme logic with comments
- Write tests for custom hooks and components
- Use descriptive names for hooks (e.g., `useFormatPrice` not `usePrice`)

## Pull Request Guidelines

1. **Before submitting:**
   - Run `yarn lint` to check for linting issues
   - Run `yarn test` to ensure all tests pass
   - Run `yarn format` to format code consistently

2. **Testing requirements:**
   - Add tests for new features and hooks
   - Update existing tests when modifying functionality
   - Ensure test coverage for edge cases

3. **Documentation:**
   - Update README.md for new features or scripts
   - Update this CONTRIBUTING.md for new development patterns
   - Add JSDoc comments for new hooks and utilities
