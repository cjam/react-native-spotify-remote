# GitHub Workflows Documentation

This repository includes automated workflows for building, testing, and releasing the React Native Spotify Remote library.

## Workflows

### 1. Build and Release (`build-and-release.yml`)

This is the main workflow that builds and tests the library on macOS (required for both iOS and Android builds).

**Triggers:**
- Push to `main` or `master` branches
- Push of tags matching `v*` (e.g., `v1.0.0`)
- Pull requests to `main` or `master` branches
- Manual workflow dispatch with optional release flag

**Jobs:**

#### Build Job
Runs on every trigger and performs:
- Checkout with recursive submodules (for Spotify SDKs)
- Setup Node.js, Java, and Ruby
- Install dependencies
- Build TypeScript library
- Generate documentation
- Build Android library using Gradle
- Build iOS library using Xcode
- Upload build artifacts
- Verify no uncommitted changes

#### Release Job
Runs only on version tags or manual dispatch:
- Uses `release-it` to create GitHub releases
- Updates changelog
- Creates git tags (if manual dispatch)
- Publishes release notes

#### Publish to npm Job
Runs only on version tags:
- Builds the library
- Runs prepack/postpack scripts for iOS SDK preparation
- Publishes to npm registry

### 2. PR Check (`pr-check.yml`)

A lightweight workflow that runs quickly on pull requests for fast feedback.

**Triggers:**
- Pull requests to `main` or `master` branches

**Jobs:**
- Quick TypeScript build check on Ubuntu (faster than macOS)
- TypeScript compilation
- Documentation generation
- Type checking without emit

## Required Secrets

To use these workflows, configure the following secrets in your repository settings:

### `GITHUB_TOKEN`
- **Description**: Automatically provided by GitHub Actions
- **Usage**: Creating releases, uploading assets
- **Setup**: No action needed (automatically available)

### `NPM_TOKEN`
- **Description**: Authentication token for publishing to npm
- **Usage**: Publishing packages to npm registry
- **Setup**:
  1. Log in to [npmjs.com](https://www.npmjs.com)
  2. Go to "Access Tokens" in your account settings
  3. Generate a new "Automation" token
  4. Add it as a secret named `NPM_TOKEN` in your GitHub repository settings

## How to Create a Release

### Option 1: Tag-based Release (Recommended)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes:
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore: prepare release v1.0.0"
   ```
4. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin main --tags
   ```

The workflow will:
- Build and test the library
- Create a GitHub release
- Publish to npm

### Option 2: Manual Workflow Dispatch

1. Go to Actions tab in GitHub
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. Check "Create a release" option
5. Click "Run workflow" button

This will run `release-it` interactively to bump version, update changelog, and create a release.

## Build Requirements

### macOS Runner
The main build workflow uses macOS runners because:
- **iOS builds** require Xcode (only available on macOS)
- **Android builds** can run on macOS (has Android SDK and Java)
- This allows building both platforms in a single workflow

### Dependencies
- **Node.js 18**: For TypeScript compilation and tooling
- **Java 17**: For Android Gradle builds
- **Ruby 3.0**: For CocoaPods (iOS dependency management)
- **Xcode**: For building iOS library (included on macOS runners)

## Submodules

The repository uses git submodules for Spotify SDKs:
- `ios/external/SpotifySDK` - iOS Spotify SDK
- `android/external/SpotifySDK` - Android Spotify SDK

Workflows automatically initialize submodules with:
```bash
git submodule update --init --recursive
```

## Artifacts

Build artifacts are uploaded and available for download:
- **TypeScript dist**: Compiled JavaScript and type definitions
- **Documentation**: Generated TypeDoc HTML documentation
- **Android build**: Compiled Android library
- **Retention**: 7 days for full builds, 3 days for PR checks

## Troubleshooting

### iOS Build Fails
- Check that CocoaPods can install dependencies
- Verify Xcode version compatibility
- Check for missing provisioning profiles (build uses simulator, so CODE_SIGNING_ALLOWED=NO)

### Android Build Fails
- Verify Gradle version compatibility
- Check Java version (requires Java 17)
- Ensure submodules are properly initialized

### Release Fails
- Ensure `NPM_TOKEN` secret is configured
- Verify you have npm publish permissions for the package
- Check that version in package.json doesn't already exist on npm
- Ensure CHANGELOG.md is properly formatted

### Submodule Issues
- Workflows check out with `submodules: recursive`
- If submodules fail to initialize, check `.gitmodules` URLs are accessible
- GitHub Actions needs access to submodule repositories

## Local Testing

To test the build process locally:

```bash
# Install dependencies
yarn install

# Initialize submodules
git submodule update --init --recursive

# Build TypeScript
yarn build

# Build Android (requires Android SDK)
cd android && ./gradlew assembleRelease

# Build iOS (requires macOS and Xcode)
cd example/ios
pod install
xcodebuild -workspace example.xcworkspace -scheme example -configuration Release -sdk iphonesimulator build
```

## Workflow Customization

### Changing Node.js Version
Edit the `node-version` in both workflow files:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # Change this version
```

### Changing macOS Version
Edit the `runs-on` in the build job:
```yaml
build:
  runs-on: macos-13  # Use specific macOS version
```

Available options: `macos-latest`, `macos-13`, `macos-12`

### Adding Linting
Add a step in the PR check workflow:
```yaml
- name: Run linter
  run: yarn lint
```

## Best Practices

1. **Test locally** before pushing to ensure builds work
2. **Update CHANGELOG.md** before creating releases
3. **Use semantic versioning** for tags (v1.0.0, v1.0.1, etc.)
4. **Monitor workflow runs** in the Actions tab
5. **Keep secrets up to date** (rotate NPM tokens periodically)
6. **Review artifact uploads** to ensure necessary files are preserved
