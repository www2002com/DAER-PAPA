# Sodam performance r2: clean outline

The welcome, listen and dance animations and their posters are cut again from the same 1440 × 1440
Kling originals. Character design, framing, timing, frame choice and the 3D poses are unchanged.

## Why r1 looked broken

- The generated videos already carry H.264 block artefacts along the silhouette: 8–16 px grey,
  white and cyan squares on the black background, and staircase steps on the scarf tips.
- r1 shrank the frames to 768 px and kept every pixel brighter than 48 that touched the character.
  The squares became part of the body. A 7 × 7 square erosion and a 2.5 px feather left them as a
  beaded outline, with grey and cyan specks in the edge pixels.
- The files were then shown larger than they are. The received invitation enlarged a 512 px file
  to 280 CSS px on 3x phones, about 840 device px. The home companion enlarged a 352 px file, and
  for the dance a 256 px file, to 176 CSS px.
- The home files were re-encoded from the already lossy 512 px delivery.

## r2 processing

1. Work at the full 1440 px. A pixel is plush when it is clearly blue: luma above 40, B − R above
   60 and B − G above 30. It is cream when it is warm: luma above 120 and R − B above 10. Deep
   interior pixels of both clips pass at the 0.5th percentile. The neutral grey/white squares and
   cyan squares fail.
2. Fill eyes, mouth and stitches. An enclosed hole that is mostly pure black is background seen
   through a gap, such as between the legs, and stays transparent. A hole under 600 px is a codec
   square and is filled.
3. Remove block protrusions with a round opening of radius 7 and refill dents with a closing of
   radius 5. The outline is the 0.5 level of the mask blurred at σ = 8 px, anti-aliased once.
4. Within 12 px of the outline, a pixel that differs strongly from the plush colour just inside it
   takes that plush colour. These are a codec square or a black-mixed edge. Other rendered shading
   is kept.
5. Resample once from 1440 px to each delivery size with the r1 transform, scaled.

## Delivery

| File | Size | Used by |
| --- | --- | --- |
| `Sodam-{welcome,listen}-r2.webp` and `-poster-r2.webp` | 640 px | Received invitation |
| `Sodam-{welcome,listen}-home-r2.webp` and `-home-poster-r2.webp` | 384 px | Home companion, same as the 3D poses |
| `Sodam-dance-149bpm-r2.webp` | 384 px | Home companion, music-note button |

Each poster matches its animation's size, so the swap from still to motion keeps the same
sharpness. `tests/sodam-media.test.tsx` pins these sizes and the poster pairing.

Measurements, scripts and before/after captures are in
`Sodam-v2-Continue-at-Home/exports/Sodam-performance-r2/`.
