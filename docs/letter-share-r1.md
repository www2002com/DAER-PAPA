# Sodam letter sharing — 2026-10-29

The letter composer now always exposes a full-width “편지 공유하기” button. Its native dialog starts with KakaoTalk, followed by Instagram. Existing drafts, archives, card export, hero motion, dance and teaser remain intact.

- Kakao developer app: DEAR PAPA, ID 1628157. Company/developer label supplied by the user: DEAR PAPA 개발자 SODAM. JavaScript SDK and product-link domains: https://dearpapa.kr. The JS key is a public browser key, domain restricted in Kakao; no Admin/REST secret is included in the site.
- SDK: Kakao JavaScript 2.8.4, pinned with the official SHA-384 integrity value. The SDK loads only when the share dialog opens. Its feed template shows the generic Sodam arrival sticker, sender name and “편지 읽기” recipient link, without the letter body in preview text.
- Recipient page: /letter/received, noindex/nofollow, no-referrer, no SiteAnalytics or CampaignAttribution. The fragment holds versioned, validated UTF-8/base64url letter data; it is not encryption. Anyone with the link can read it; deleting the sender's local draft does not revoke a previously shared link. Shared content is React text, never HTML. Reading does not overwrite a recipient's local draft.
- Instagram: local browser canvas creates a 1080×1920 PNG from the existing handwritten card and Sodam sticker. Native file sharing is offered only when supported, with image download always available. The site cannot choose or reorder OS share targets and does not automatically post to Instagram.
- Cancellation has no sent/success confirmation. Kakao SDK errors expose a native share/link-copy fallback. Keyboard dialog focus, Escape, tab navigation and reduced-motion presentation are supported.

## Asset provenance

Built-in image_gen was used, with the approved Sodam-v2-3D-front-r1.png as character identity reference. The selected second pass is saved as `public/media/sodam-letter-share-r1/Sodam-letter-arrived-r2.png` (1254×1254 RGBA, 913064 bytes). Its 768×768 WebP derivative is 61114 bytes. Alpha min/max 0/255; original generated alpha is preserved. The draft and final generated files are archived separately in the user's `exports/Sodam-letter-share-r1/source/` folder. Existing character assets were not overwritten.

Final imagegen edit prompt (the edit target was the first generated transparent sticker):

> Refine this exact transparent Sodam sticker, preserving its pose, character identity, colors, ear asymmetry, expression, two scarf tails and exact Korean caption '편지 왔어요!!'. Make only these production corrections: 1) remove all stray white/colored speckles, dirt, cyan/blue fringes and detached pixels outside the actual speech bubble and character; create perfectly clean smoothly antialiased transparent alpha edges, no floor or shadow. 2) Make the handheld postal envelope about 20% smaller and position it slightly lower at the waist, so a clearly visible continuous band of BLUE TORSO separates the ivory neck scarf's bottom tip from the envelope's top edge. The envelope must not touch or merge into the scarf and the holding paw must remain naturally connected. Preserve the separate neck scarf with its green stitch and two tails; preserve two hands and two planted feet. Keep every element fully within the frame with margins. Do not add or change any words; no other additions. This is the same 3D matte Sodam sticker, with clean cutout and clearer separation of props.

## Validation

`npm run build`: 159 tests passed; TypeScript, 21 static pages and preservation verification passed (9 routes, 10 JSON-LD blocks, original facts/paragraphs/FAQ/metadata/root files). Browser checks cover Kakao-first dialog, desktop/mobile layout, received-letter opening and actual 1080×1920 PNG download. The sample download contains a test letter, not a visitor's private content. No message was sent to another person during verification.

Official integration references: https://developers.kakao.com/docs/ko/tutorial/js-share and https://developers.kakao.com/docs/ko/kakaotalk-share/js-link. OS sharing limits: https://www.w3.org/TR/web-share/.
