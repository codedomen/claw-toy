Project guidelines for maintainers and contributors

Context

- App type: Expo (React Native 0.79, Expo SDK 53) TypeScript app with Three.js and @react-three/\* on mobile and web.
- State: mobx, mobx-state-tree; storage via react-native-mmkv.
- Navigation: @react-navigation (native-stack + bottom-tabs).
- 3D/GL: three, @react-three/fiber, @react-three/drei, expo-gl.
- Tooling: EAS for native builds, Metro bundler, ESLint + Prettier, Jest (jest-expo) for tests.

Build and configuration

- Node engines: package.json enforces Node ^18.18.0 or >=20.0.0. Use one of these versions (nvm/nvs recommended).
- Install: npm install. On Windows, prefer PowerShell and ensure long paths are enabled if needed.
- Dev run:
  - Start Metro with dev client: npm start
  - iOS: npm run ios (requires Xcode + iOS Simulators; for devices use dev client built via EAS)
  - Android: npm run android (requires Android SDK + a running emulator or device)
  - Web: npm run web (starts Expo for web). For static export: npm run bundle:web then npm run serve:web to preview dist.
- ADB port forwards (Android device): npm run adb will set up reverse ports for Metro (8081) and common dev servers used in this repo.
- Prebuild (native projects): If native code needs to be generated/regenerated, use npm run prebuild:clean. This wipes ios/android folders and regenerates with expo prebuild.
- EAS builds (local):
  - iOS: npm run build:ios:sim (simulator) or npm run build:ios:dev/preview/prod
  - Android: npm run build:android:sim or npm run build:android:dev/preview/prod
  - These use profiles from eas.json and expo-build-properties to align native SDKs.

Testing

- Framework: Jest via jest-expo preset; TypeScript tests are supported out of the box.
- Commands:
  - Run all tests: npm test
  - Run a single file: npx jest app/components/Text.test.tsx
  - Watch mode: npx jest --watch
- Configuration:
  - jest.config.js uses preset: "jest-expo" and setupFilesAfterEnv: ["<rootDir>/test/setup.ts"].
  - test/setup.ts registers Testing Library matchers, uses fake timers, and mocks GL/Expo/gesture-handler/reanimated to make tests deterministic in a JS environment.
  - tsconfig.json excludes test/\*_/_ from tsc emit, so tests don’t affect type builds.
- Adding a new test:
  - File naming: place alongside code as _.test.ts or _.test.tsx under app/.
  - Example (component test pattern already used in app/components/Text.test.tsx):
    import { render } from "@testing-library/react-native";
    import { NavigationContainer } from "@react-navigation/native";
    import { Text } from "@/components/Text";
    describe("Text", () => {
    it("renders provided text", () => {
    const { getByText } = render(
    <NavigationContainer>
    <Text text="Hello" />
    </NavigationContainer>
    );
    expect(getByText("Hello")).toBeTruthy();
    });
    });
  - For hooks or non-UI utilities, a plain Jest test (\*.test.ts) is fine.
- Notes/pitfalls:
  - If you add modules that touch native functionality, consider mocking them in test/setup.ts to keep tests hermetic.
  - React Native Reanimated must be mocked; this repo’s setup already does that.
  - For navigation-related components in tests, wrap with NavigationContainer (see Text.test.tsx).
  - If you see expect is not defined errors with Testing Library matchers, ensure setupFilesAfterEnv is used (already configured) and avoid moving extend-expect into setupFiles.

Verifications performed for these guidelines

- Brought up Jest environment with jest-expo, added test/setup.ts, and verified all existing tests in:
  - app/components/Text.test.tsx
  - app/models/Episode.test.ts
  - app/services/api/apiProblem.test.ts
  - app/utils/storage/storage.test.ts
    All passed locally using npm test.
- Demonstrated creating and running a simple test (smoke test) and confirmed it runs and passes, then removed the demo file to keep the repo clean as per request.

Development workflow and code style

- Linting/formatting:
  - Lint and auto-fix: npm run lint
  - Check only: npm run lint:check
  - ESLint config uses eslint-config-expo plus Prettier; keep code Prettier-compatible. If adding rules, respect existing conventions.
- TypeScript:
  - Strict settings enabled (noImplicit\* true). Fix types rather than using any.
  - Path aliases: @/_ -> ./app/_ and assets/_ -> ./assets/_ (configured in tsconfig.json). Prefer these over relative ../../../ imports.
- Project structure notes:
  - Entry: index.tsx; app/ contains screens, components, models (MST), services, utils.
  - Localization: i18next/react-i18next present; when adding screens/components, wire translation keys rather than hardcoding strings where possible.
  - Storage: react-native-mmkv is used via app/utils/storage; when adding persistent state, integrate with existing storage utilities to keep consistency and performance.
- 3D/GL stack:
  - three + @react-three/fiber + @react-three/drei with expo-gl. When writing new 3D scenes, prefer Fiber idioms and Drei helpers, and be mindful of React Native rendering constraints (no DOM events; use gesture-handler or RN responders).
  - For deterministic tests around three/fiber code, abstract math-heavy or scene-graph logic into pure functions and add unit tests there; avoid trying to render GL contexts in Jest.
  - gltfjsx: CLI added (devDependency) to generate typed React components from .gltf/.glb. Usage (run locally):
    - npx gltfjsx path/to/model.glb --transform --types
    - This emits a component with a GLTFResult type (import type { GLTF } from "three-stdlib").
    - In this repo, Scene.tsx follows this pattern and uses GLTFResult for strict nodes/materials typing. You can copy generated node/material shapes into your components to keep strict typing without committing generated files.

Troubleshooting

- Jest cannot find jest-expo or React Native modules:
  - Ensure devDependencies include jest, jest-expo, @testing-library/react-native, and react-test-renderer matching the React version in this repo (React 19.0.0 -> react-test-renderer 19.0.0).
- Animated or reanimated warnings during tests:
  - Keep the reanimated mock in test/setup.ts. Avoid importing NativeAnimatedHelper directly (paths changed in RN 0.79).
- Android device cannot connect to Metro:
  - Run npm run adb to set up reverse proxies for required ports.
- EAS local build failures:
  - Align Xcode/Android SDK versions with Expo SDK 53; clear prebuild with npm run prebuild:clean if native projects got out of sync.

CI considerations

- If adding CI, use Node 18.18 or 20.x images. Cache node_modules. Run commands: npm ci && npm run compile && npm run lint:check && npm test. For web previews, you can add npm run bundle:web as a separate job.

Housekeeping

- Keep tests colocated with the code they verify, short and deterministic.
- If you add new native modules or Expo modules, update test/setup.ts with appropriate mocks to keep the suite green.
- Document any new scripts in package.json in this guidelines file as needed.
