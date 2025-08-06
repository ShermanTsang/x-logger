# Contributing to Sherman Logger

Thank you for your interest in contributing to `@shermant/logger`! This guide will help you get started with contributing to the project.

## Development Setup

### Prerequisites

- **Bun** (recommended) or **Node.js** 18+
- **Git**
- **TypeScript** knowledge
- **Vitest** for testing
- **VitePress** for documentation

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/Logger-TypeScript.git
   cd Logger-TypeScript
   ```

2. **Install Dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Run Tests**
   ```bash
   bun run test
   # or
   npm run test
   ```

4. **Start Documentation Server**
   ```bash
   bun run docs:dev
   # or
   npm run docs:dev
   ```

## Project Structure

```
sherman-logger/
├── src/                    # Source code (TypeScript)
│   ├── index.ts           # Main entry point
│   ├── logger.ts          # Core logger implementation
│   ├── stream.ts          # Stream logger implementation
│   └── types.ts           # Type definitions
├── test/                   # Test files (Vitest)
│   ├── index.test.ts      # Main test suite
│   └── browser-integration.test.ts  # Browser tests
├── docs/                   # Documentation (VitePress)
│   ├── .vitepress/        # VitePress configuration
│   ├── *.md              # Documentation pages
│   └── browser-test.html  # Browser test page
├── .output/dist/          # Build output
└── examples/              # Usage examples (deprecated - moved to docs)
```

## Development Workflow

### 1. Code Style and Standards

We use **ESLint** with `@antfu/eslint-config` for consistent code style:

```bash
# Check linting
bun run lint

# Fix linting issues
bun run lint:fix
```

**Code Style Guidelines:**
- Use TypeScript with strict mode
- Follow ESM (ES Modules) syntax
- Use meaningful variable and function names
- Include JSDoc comments for public APIs
- Prefer explicit types over `any`
- Use chainable method patterns where appropriate

### 2. Testing Requirements

All contributions must include appropriate tests:

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

**Testing Guidelines:**
- Write tests for all new features
- Include both positive and negative test cases
- Test error conditions and edge cases
- Maintain or improve test coverage
- Use descriptive test names

**Test Structure:**
```typescript
import { describe, expect, it } from 'vitest'
import { logger } from '../src'

describe('Feature Name', () => {
  it('should handle basic case', () => {
    // Test implementation
    expect(result).toBe(expected)
  })

  it('should handle error case', () => {
    // Error test implementation
    expect(() => errorCase()).toThrow()
  })
})
```

### 3. Documentation Requirements

All features must be documented:

```bash
# Start documentation server
bun run docs:dev

# Build documentation
bun run docs:build
```

**Documentation Guidelines:**
- Update relevant documentation pages
- Include practical code examples
- Show TypeScript type information
- Provide both Bun and Node.js examples when applicable
- Update API reference if needed

### 4. Building and Validation

Before submitting, ensure everything builds correctly:

```bash
# Build the project
bun run build

# Validate all checks pass
bun run test && bun run build && bun run docs:build
```

## Contribution Types

### 🐛 Bug Fixes

1. **Create an Issue** (if one doesn't exist)
   - Describe the bug clearly
   - Include reproduction steps
   - Provide environment details

2. **Write a Test** that reproduces the bug
   ```typescript
   it('should fix bug with specific scenario', () => {
     // Test that currently fails
     expect(buggyBehavior()).toBe(expectedBehavior())
   })
   ```

3. **Fix the Bug** and ensure the test passes

4. **Update Documentation** if the fix affects usage

### ✨ New Features

1. **Discuss First** - Create an issue to discuss the feature
2. **Design API** - Ensure it fits the chainable pattern
3. **Implement Feature** with TypeScript types
4. **Write Comprehensive Tests**
5. **Document the Feature** with examples
6. **Update Type Definitions** if needed

**Feature Implementation Example:**
```typescript
// src/logger.ts
export class Logger {
  // Existing methods...

  /**
   * New feature method
   * @param param - Description of parameter
   * @returns Logger instance for chaining
   */
  newFeature(param: string): Logger {
    // Implementation
    return this
  }
}
```

### 📚 Documentation Improvements

1. **Identify Documentation Gaps**
2. **Write Clear, Practical Examples**
3. **Update VitePress Configuration** if adding new pages
4. **Test Documentation Locally**

### 🧪 Test Improvements

1. **Identify Missing Test Coverage**
2. **Add Comprehensive Test Cases**
3. **Improve Test Organization**
4. **Add Browser Compatibility Tests**

## API Design Guidelines

### Chainable Methods

All logger methods should support chaining:

```typescript
// Good - chainable
logger.info
  .prefix('API')
  .text('Request completed')
  .detail('Status: 200')
  .time()
  .print()

// Avoid - non-chainable
logger.setPrefix('API')
logger.setText('Request completed')
logger.addDetail('Status: 200')
logger.print()
```

### TypeScript Support

Ensure strong TypeScript support:

```typescript
// Provide proper type definitions
interface LoggerOptions {
  prefix?: string
  timestamp?: boolean
  colors?: boolean
}

// Use generics where appropriate
type LogLevel = 'info' | 'warn' | 'error' | 'success'

// Export types for users
export type { LoggerOptions, LogLevel }
```

### Cross-Platform Compatibility

Ensure features work across environments:

```typescript
// Environment detection
const isBrowser = typeof window !== 'undefined'
const isNode = typeof process !== 'undefined'

// Conditional behavior
if (isBrowser) {
  // Browser-specific implementation
}
else if (isNode) {
  // Node.js-specific implementation
}
```

## Pull Request Process

### 1. Before Submitting

- [ ] All tests pass (`bun run test`)
- [ ] Code builds successfully (`bun run build`)
- [ ] Documentation builds (`bun run docs:build`)
- [ ] ESLint passes (`bun run lint`)
- [ ] Changes are documented
- [ ] Commit messages are clear

### 2. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Added/updated tests
- [ ] All tests pass
- [ ] Manual testing completed

## Documentation
- [ ] Updated relevant documentation
- [ ] Added code examples
- [ ] Updated API reference

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Changes are backward compatible
- [ ] No breaking changes (or clearly documented)
```

### 3. Review Process

1. **Automated Checks** - CI/CD will run tests and builds
2. **Code Review** - Maintainers will review your code
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, your PR will be merged

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for backward-compatible bug fixes

### Release Checklist

1. **Update Version** in `package.json`
2. **Update Changelog** with new features and fixes
3. **Run Full Test Suite**
4. **Build and Test Package**
5. **Create Release Tag**
6. **Publish to NPM**
7. **Update Documentation**

## Code of Conduct

### Our Standards

- **Be Respectful** - Treat everyone with respect
- **Be Inclusive** - Welcome diverse perspectives
- **Be Constructive** - Provide helpful feedback
- **Be Patient** - Help others learn and grow

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information

### Enforcement

Report any unacceptable behavior to the project maintainers. All reports will be reviewed and investigated promptly.

## Getting Help

### Resources

- **Documentation**: [https://shermant.github.io/x-logger/](https://shermant.github.io/x-logger/)
- **Issues**: [GitHub Issues](https://github.com/ShermanTsang/Logger-TypeScript/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ShermanTsang/Logger-TypeScript/discussions)

### Questions

- **General Questions** - Use GitHub Discussions
- **Bug Reports** - Create a GitHub Issue
- **Feature Requests** - Create a GitHub Issue with feature template
- **Security Issues** - Email maintainers directly

### Community

- **GitHub**: [@ShermanTsang](https://github.com/ShermanTsang)
- **NPM**: [@shermant/logger](https://www.npmjs.com/package/@shermant/logger)

## Development Tips

### Debugging

```typescript
// Use console.log for debugging during development
console.log('Debug:', { variable, state })

// Remove debug logs before committing
// Consider using a debug utility instead
```

### Performance

```typescript
// Avoid expensive operations in hot paths
// Use lazy evaluation where possible
// Consider memory usage for large applications

// Good - lazy evaluation
get formattedMessage() {
  return this._message || this.formatMessage()
}

// Avoid - eager evaluation
constructor() {
  this.formattedMessage = this.formatMessage() // Called even if not used
}
```

### Browser Testing

```bash
# Open browser test page
open docs/browser-test.html

# Or serve locally
bun run docs:dev
# Navigate to /browser-test.html
```

### IDE Setup

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Vitest
- VitePress

**Settings:**
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

Thank you for contributing to Sherman Logger! Your contributions help make this project better for everyone. 🎉
