# Sodam performance r1

> Superseded for delivery by [r2](sodam-performance-r2.md): same originals and timing, cut again with a clean outline at 768/384 px.

The home companion and received-letter invitation now show a rendered facial performance: a soft blink and smiling eyes for welcome, and a small attentive head movement for listening. These are new generated video derivatives, not a rigged 3D master or CSS cutout animation.

- The default is the welcome performance. The previously approved 149 BPM dance remains available through its own button.
- Two 1440 × 1440 originals were generated with Kling 4.0 (5.041667 s, 24 fps), 118 Sunra credits each. One 2-second wordless effect was generated with ElevenLabs Sound Effects for 1 credit. The user approved the total 237 credits before execution.
- Transparent WebP delivery: 512 × 512, 91 frames, 18 fps plus a four-second still hold; 9.056-second loop. The 512 px files are about 1.7 MB. The home companion uses separate 352 px variants (1,040,184 / 1,064,760 bytes) and downloads motion only when visible. Posters are small static WebPs. Original audio from the video container is discarded.
- The matte removes only the connected black exterior, retaining dark eyes and mouth. Constant framing matches the normalized 3D poses. No per-frame repositioning, reversed loops or body deformation was introduced. The originals remain in the Sodam bundle.
- Motion stops offscreen, in hidden tabs, under reduced-motion preferences, on explicit pause, while typing or asking a question, and during serious support conversations. A failed motion asset falls back to its poster. Posters load before the animation; explicit replay uses a cached Blob and a new local object URL to restart the decoder, revoking the old URL.
- Sound starts off, is never scheduled by an effect or a loop, and only plays after a direct visitor action. It pauses when typing, asking a question, leaving the viewport, or hiding the tab. The visitor's opt-in remains selected within the mounted component; a new visit starts silent. Playback failure returns the sound control to off.
- Controls use stable accessible names and `aria-pressed`. The received invitation retains its Sodam image description. At 320 px the character and message stack to keep the letter readable.
- The ten 3D poses from `docs/sodam-poses-r1.md` are integrated with the home state. Serious support has priority over error/product states and always remains listening. Existing letter text, prepared/AI replies, brand copy and privacy behavior are preserved.

Production sources are in `public/media/sodam-performance-r1/`. Original media, prompts, actual Sunra job records, frame contact sheets, processing measurements and automatic audio screening are in `Sodam-v2-Continue-at-Home/exports/Sodam-performance-r1/`.

Visual review checks grounded feet, consistent costume and proportions, intact paws/scarf, facial transitions and the first/last frame seam. It is not a physics simulation. Automatic audio screening (faster-whisper tiny with VAD) detected no speech segments in the two-second effect; that result is not a human listening assessment.
