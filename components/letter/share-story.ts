import { renderCard, toBlob, type LetterInput } from './card';
import { SODAM_LETTER_STICKER } from './share-assets';

/** Entirely in the browser: no letter or image is uploaded to generate this PNG. */
export async function createLetterStory(letter: LetterInput): Promise<Blob> {
  const card = await renderCard(letter);
  if (!card) throw new Error('편지를 이미지에 담을 수 없어요.');
  const sticker = new Image();
  sticker.src = SODAM_LETTER_STICKER;
  await sticker.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('이미지를 만들 수 없어요.');
  ctx.fillStyle = '#e9f1f5';
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.drawImage(sticker, 300, 64, 480, 480);
  ctx.drawImage(card, 108, 574, 864, 1080);
  ctx.fillStyle = '#274657';
  ctx.textAlign = 'center';
  ctx.font = '500 30px sans-serif';
  ctx.fillText('DEAR PAPA', 540, 1750);
  ctx.font = '24px sans-serif';
  ctx.fillText('dearpapa.kr', 540, 1798);
  const blob = await toBlob(canvas);
  if (!blob) throw new Error('이미지를 저장할 수 없어요.');
  return blob;
}
