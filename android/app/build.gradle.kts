plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.ocshimeji.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.ocshimeji.app"
        minSdk = 26            // TYPE_APPLICATION_OVERLAY
        targetSdk = 35
        versionCode = 33
        versionName = "3.3.0"
    }

    // Single source of truth: the game lives in /web and is shipped as the asset root.
    sourceSets["main"].assets.srcDirs("../../web")

    buildTypes {
        release {
            isMinifyEnabled = false
            // Signed with the debug key so the APK installs for testing; replace with a
            // real keystore (see android/README.md) before publishing.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { buildConfig = true }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.webkit:webkit:1.12.1")
}
