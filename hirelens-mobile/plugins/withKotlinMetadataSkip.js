const { withProjectBuildGradle } = require('@expo/config-plugins');

// play-services-ads (pulled in by react-native-google-mobile-ads) is compiled
// with a newer Kotlin than Expo SDK 54's toolchain supports, which fails the
// Kotlin metadata-version check. This flag tells the compiler to skip that
// check so the (ABI-compatible) library links fine.
const MARKER = 'Xskip-metadata-version-check';
const SNIPPET = `

// Injected by withKotlinMetadataSkip config plugin
allprojects {
    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
            freeCompilerArgs += ["-Xskip-metadata-version-check"]
        }
    }
}
`;

module.exports = function withKotlinMetadataSkip(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language === 'groovy' && !cfg.modResults.contents.includes(MARKER)) {
      cfg.modResults.contents += SNIPPET;
    }
    return cfg;
  });
};
