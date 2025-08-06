# Changelog

All notable changes to `@shermant/logger` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation with VitePress
- Browser integration tests with Vitest
- TypeScript support documentation
- Custom types creation guide
- Stream logging documentation
- Browser support guide
- Contributing guidelines
- Interactive browser demo page

### Changed
- Moved browser test files to proper documentation structure
- Consolidated examples into documentation
- Improved project organization and file structure

### Removed
- Deprecated standalone example files (moved to docs)
- Empty `.vitepress` directory from root

## [1.2.0] - 2024-01-15

### Added
- Stream logger functionality with real-time updates
- Support for multiple stream states (start, stop, succeed, fail)
- Enhanced browser compatibility detection
- Custom log type creation with styling options
- Time-based logging with configurable timestamps
- Divider support for visual separation
- Highlight syntax with `[[text]]` notation

### Changed
- Improved TypeScript type definitions
- Enhanced chainable API design
- Better error handling across all methods
- Optimized performance for high-frequency logging

### Fixed
- Browser console styling issues
- Memory leaks in stream logger
- TypeScript compilation errors in strict mode
- Cross-platform compatibility issues

## [1.1.0] - 2024-01-01

### Added
- Chainable API design for fluent logging
- Support for custom prefixes and details
- Cross-platform compatibility (Node.js, Browser, Bun)
- TypeScript support with full type definitions
- ESM module support
- Basic stream logging capabilities

### Changed
- Refactored core logger architecture
- Improved method chaining performance
- Enhanced browser detection logic

### Fixed
- Console output formatting issues
- Module import/export problems
- TypeScript type inference issues

## [1.0.0] - 2023-12-15

### Added
- Initial release of Sherman Logger
- Basic logging functionality (info, warn, error, success)
- Simple text and detail logging
- Cross-platform support
- TypeScript definitions
- NPM package publication

### Features
- Lightweight and fast logging
- No external dependencies for core functionality
- Simple API design
- Browser and Node.js compatibility

## Version History

### Major Releases

#### v1.2.x - Stream & Advanced Features
- **Focus**: Stream logging, custom types, advanced features
- **Key Features**: Real-time updates, custom styling, enhanced TypeScript support
- **Target**: Production applications with complex logging needs

#### v1.1.x - Chainable API
- **Focus**: Fluent API design and cross-platform compatibility
- **Key Features**: Method chaining, improved TypeScript support, better browser compatibility
- **Target**: Modern JavaScript applications

#### v1.0.x - Foundation
- **Focus**: Core logging functionality
- **Key Features**: Basic logging, cross-platform support, TypeScript definitions
- **Target**: Simple logging needs

## Migration Guide

### From v1.1.x to v1.2.x

**New Features Available:**
```typescript
// Stream logging (new in v1.2.0)
const stream = logger.stream
stream.text('Processing...').update()
stream.text('Complete!').state('succeed')

// Custom types (new in v1.2.0)
logger.type('custom', ['bgMagenta', 'white'])
  .text('Custom styled message')
  .print()

// Highlights (new in v1.2.0)
logger.info
  .text('This has [[highlighted]] text')
  .print()

// Dividers (new in v1.2.0)
logger.info.divider('=', 40)
```

**Breaking Changes:**
- None - v1.2.x is fully backward compatible with v1.1.x

### From v1.0.x to v1.1.x

**API Changes:**
```typescript
// Old API (v1.0.x)
logger.info('Simple message')
logger.error('Error message')

// New Chainable API (v1.1.x+)
logger.info.text('Simple message').print()
logger.error.text('Error message').print()

// Enhanced features
logger.info
  .prefix('API')
  .text('Request completed')
  .detail('Status: 200')
  .time()
  .print()
```

**Migration Steps:**
1. Update method calls to use chainable API
2. Add `.print()` to complete the chain
3. Utilize new features like prefixes and details
4. Update TypeScript imports if needed

## Development Changelog

### Documentation Updates

#### 2024-01-20
- **Added**: Comprehensive VitePress documentation
- **Added**: Interactive browser demo page
- **Added**: TypeScript support guide
- **Added**: Custom types documentation
- **Added**: Stream logging guide
- **Added**: Browser support documentation
- **Added**: Contributing guidelines
- **Improved**: API reference with detailed examples
- **Improved**: Getting started guide
- **Fixed**: Documentation navigation and structure

#### 2024-01-18
- **Added**: Browser integration tests with Vitest
- **Added**: Cross-platform compatibility tests
- **Moved**: Browser test files to proper structure
- **Removed**: Deprecated example files
- **Improved**: Test coverage and organization

### Build System Updates

#### 2024-01-15
- **Updated**: Bun build configuration
- **Improved**: TypeScript compilation settings
- **Added**: ESLint configuration with @antfu/eslint-config
- **Enhanced**: Vitest test configuration
- **Optimized**: Bundle size and performance

### Infrastructure Changes

#### 2024-01-10
- **Added**: GitHub Actions CI/CD pipeline
- **Added**: Automated testing and building
- **Added**: NPM package publishing automation
- **Added**: Documentation deployment to GitHub Pages
- **Improved**: Development workflow

## Roadmap Integration

### Completed Features ✅

- ✅ **Stream Logging**: Real-time log updates with state management
- ✅ **Custom Types**: User-defined log types with custom styling
- ✅ **Browser Support**: Full browser compatibility with feature detection
- ✅ **TypeScript Support**: Complete type definitions and strict mode support
- ✅ **Documentation**: Comprehensive VitePress documentation site
- ✅ **Testing**: Vitest integration with browser compatibility tests

### In Progress 🚧

- 🚧 **Performance Optimization**: Bundle size reduction and runtime performance
- 🚧 **Plugin System**: Extensible architecture for custom functionality
- 🚧 **Advanced Formatting**: Rich text formatting and custom renderers

### Planned Features 📋

- 📋 **Log Levels**: Configurable log level filtering
- 📋 **File Output**: Direct file logging capabilities
- 📋 **Remote Logging**: HTTP/WebSocket log transmission
- 📋 **Log Aggregation**: Multiple logger instance management
- 📋 **Structured Logging**: JSON and structured data support

## Breaking Changes Policy

### Semantic Versioning Promise

We follow [Semantic Versioning](https://semver.org/) strictly:

- **PATCH** (1.2.1): Bug fixes, no breaking changes
- **MINOR** (1.3.0): New features, backward compatible
- **MAJOR** (2.0.0): Breaking changes, migration required

### Breaking Change Process

1. **Deprecation Warning**: Feature marked as deprecated in minor release
2. **Migration Guide**: Detailed migration instructions provided
3. **Grace Period**: Minimum 6 months before removal
4. **Major Release**: Breaking change implemented with clear documentation

### Backward Compatibility

We maintain backward compatibility within major versions:

```typescript
// These will continue to work in all v1.x.x releases
logger.info.text('message').print()
logger.error.text('error').detail('details').print()
logger.stream.text('processing').update()
```

## Community Contributions

### Contributors

- **[@ShermanTsang](https://github.com/ShermanTsang)** - Project creator and maintainer
- **Community** - Bug reports, feature requests, and feedback

### How to Contribute

See our [Contributing Guide](./contributing.md) for detailed information on:
- Setting up development environment
- Code style and standards
- Testing requirements
- Documentation guidelines
- Pull request process

### Recognition

We appreciate all contributions to the project:
- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Shape the future of the project
- 📝 **Documentation**: Improve user experience
- 🧪 **Testing**: Ensure quality and reliability
- 💻 **Code**: Direct improvements to the codebase

## Release Notes Format

Each release includes:

### 🎉 New Features
- Major new functionality
- API additions
- Enhanced capabilities

### 🔧 Improvements
- Performance optimizations
- Better error handling
- Enhanced TypeScript support

### 🐛 Bug Fixes
- Resolved issues
- Compatibility fixes
- Edge case handling

### 📚 Documentation
- New guides and examples
- API reference updates
- Migration instructions

### ⚠️ Breaking Changes
- API changes requiring updates
- Deprecated feature removals
- Migration requirements

---

For the latest updates and detailed release information, visit our [GitHub Releases](https://github.com/ShermanTsang/Logger-TypeScript/releases) page.
