//! AutoReels Rust + WebAssembly (Wasm) Core Engine
//! - Proprietary Generative Scene Director Permutation Engine
//! - 60fps Camera Ken-Burns & Motion Physics Math
//! - Anti-Clone Domain Lock & Phone-Number Bound Subscription DRM

#![no_std]

#[cfg(not(test))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}

// Secret DRM Constants compiled into Wasm binary
const DRM_MASTER_SALT_A: u32 = 0xA7F3_92C1;
const DRM_MASTER_SALT_B: u32 = 0x5E81_D40B;
const DRM_MIX_PRIME_1: u32 = 0x85EB_CA6B;
const DRM_MIX_PRIME_2: u32 = 0xC2B2_AE35;

// Status codes returned by verify_subscription_drm
pub const STATUS_TRIAL_UNLICENSED: u32 = 0;
pub const STATUS_ACTIVE_PRO: u32 = 1;
pub const STATUS_EXPIRED: u32 = 2;
pub const STATUS_PHONE_TAMPERED: u32 = 3;
pub const STATUS_DOMAIN_CLONED: u32 = 4;

#[inline(always)]
fn avalanche32(mut x: u32) -> u32 {
    x ^= x >> 16;
    x = x.wrapping_mul(DRM_MIX_PRIME_1);
    x ^= x >> 13;
    x = x.wrapping_mul(DRM_MIX_PRIME_2);
    x ^= x >> 16;
    x
}

/// Returns engine version (100 = v1.0.0)
#[no_mangle]
pub extern "C" fn engine_version() -> u32 {
    100
}

/// Verifies FNV-1a 32-bit hash of window.location.hostname
/// Allows official Vercel deployment, localhost/127.0.0.1, and empty file:// protocol
#[no_mangle]
pub extern "C" fn verify_domain_hash(domain_fnv1a: u32) -> u32 {
    // Authorized domain hashes:
    // "dealer-reels-platform.vercel.app" -> 0x4E4A_225E (or *.vercel.app suffix check passed as flag 1)
    // "localhost" -> 0xB82E_53E5
    // "127.0.0.1" -> 0x417E_0135
    // 0 -> local file preview
    if domain_fnv1a == 0
        || domain_fnv1a == 1
        || domain_fnv1a == 0x4E4A_225E
        || domain_fnv1a == 0xB82E_53E5
        || domain_fnv1a == 0x417E_0135
    {
        1
    } else {
        0
    }
}

/// Generates a deterministic 32-bit cryptographic signature bound to:
/// 1) Dealer's phone number last 8 digits (e.g. 39218841)
/// 2) Subscription expiration date YYYYMMDD (e.g. 20261231)
#[no_mangle]
pub extern "C" fn generate_license_signature(phone_last8: u32, expiry_yyyymmdd: u32) -> u32 {
    let a = phone_last8.wrapping_mul(0x9E37_79B9) ^ DRM_MASTER_SALT_A;
    let b = expiry_yyyymmdd.rotate_left(11) ^ DRM_MASTER_SALT_B;
    let mixed = avalanche32(a.wrapping_add(b));
    // Ensure non-zero 6-digit positive code (100000..999999) for clean AR-XXXXXX license keys
    100_000 + (mixed % 900_000)
}

/// Full DRM & Anti-Sharing verification executed inside Wasm:
/// - Checks domain lock first
/// - Checks if dealer tampered with the registered phone number (prevents 1 license shared across branch)
/// - Checks cryptographic license signature
/// - Checks subscription expiration date against today_yyyymmdd
#[no_mangle]
pub extern "C" fn verify_subscription_drm(
    current_phone_last8: u32,
    registered_phone_last8: u32,
    provided_sig: u32,
    expiry_yyyymmdd: u32,
    today_yyyymmdd: u32,
    domain_fnv1a: u32,
) -> u32 {
    if verify_domain_hash(domain_fnv1a) == 0 {
        return STATUS_DOMAIN_CLONED;
    }

    // If dealer altered the phone number away from the licensed phone number -> block account sharing
    if current_phone_last8 != registered_phone_last8 {
        return STATUS_PHONE_TAMPERED;
    }

    let expected_sig = generate_license_signature(registered_phone_last8, expiry_yyyymmdd);
    if provided_sig == 0 || provided_sig != expected_sig {
        return STATUS_TRIAL_UNLICENSED;
    }

    if today_yyyymmdd > expiry_yyyymmdd {
        return STATUS_EXPIRED;
    }

    STATUS_ACTIVE_PRO
}

/// Generative Scene Director Permutation in Rust Wasm
/// Packs into 32-bit return value:
/// - bits 0..7: widget_index (0..11) guarantees 4 distinct widgets across cut_idx 0..3
/// - bits 8..15: position_index (0..2)
/// - bits 16..23: camera_index (0..3)
/// - bits 24..31: theme_index (0..7)
#[no_mangle]
pub extern "C" fn compute_scene_slot(seed: u32, cut_idx: u32) -> u32 {
    let base_hash = avalanche32(seed ^ 0x7F4A_7C15);
    let theme_idx = (base_hash >> 3) % 8;

    // 12-element Feistel-like permutation without repetition for cut_idx 0..3
    let start = (base_hash % 12) as u32;
    // Coprime step to 12: pick from {1, 5, 7, 11}
    let steps: [u32; 4] = [1, 5, 7, 11];
    let step = steps[((base_hash >> 7) % 4) as usize];
    let widget_idx = (start + (cut_idx % 4) * step) % 12;

    let cut_hash = avalanche32(base_hash ^ ((cut_idx + 1) * 0x45D9_F3B));
    let pos_idx = cut_hash % 3;
    let cam_idx = (cut_hash >> 5) % 4;

    (widget_idx & 0xFF)
        | ((pos_idx & 0xFF) << 8)
        | ((cam_idx & 0xFF) << 16)
        | ((theme_idx & 0xFF) << 24)
}

/// Computes 60fps Ken Burns camera scale multiplied by 10000 (e.g. 10850 = 1.085x)
#[no_mangle]
pub extern "C" fn compute_camera_scale_milli(local_t_ms: u32, camera_id: u32) -> u32 {
    let clamped = if local_t_ms > 2000 { 2000 } else { local_t_ms };
    // progress 0..1000
    let p = clamped / 2;
    match camera_id % 4 {
        0 => 10200 + (p * 110) / 100, // KEN_BURNS_IN: 1.02 -> 1.13
        1 => 10900,                   // PAN_RIGHT: steady 1.09x
        2 => 10900,                   // PAN_LEFT: steady 1.09x
        _ => 10400 + (p * 80) / 100,  // DYNAMIC_TILT: 1.04 -> 1.12
    }
}

/// Computes 60fps camera horizontal pan in pixels (-40..+40)
#[no_mangle]
pub extern "C" fn compute_camera_pan_px(local_t_ms: u32, camera_id: u32) -> i32 {
    let clamped = if local_t_ms > 2000 { 2000 } else { local_t_ms } as i32;
    // progress -500..+500
    let centered = (clamped / 2) - 500;
    match camera_id % 4 {
        1 => (centered * 56) / 1000,  // PAN_RIGHT: -28px -> +28px
        2 => -(centered * 56) / 1000, // PAN_LEFT: +28px -> -28px
        _ => 0,
    }
}
