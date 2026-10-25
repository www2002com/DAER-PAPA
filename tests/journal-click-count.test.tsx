import { describe, expect, it } from 'vitest';
import { journalClickData } from '@/lib/analytics';

describe('journal click counts', () => {
  it('sends only page slug and link name on the three counted pages', () => {
    expect(journalClickData('journal_product_box_clicked', '/journal/after-shave-gift')).toEqual({ page: 'after-shave-gift', link: 'product_box' });
    expect(journalClickData('journal_letter_link_clicked', '/journal/dad-gift-skincare-guide/')).toEqual({ page: 'dad-gift-skincare-guide', link: 'letter' });
    expect(journalClickData('journal_product_box_clicked', '/journal/dad-allinone-how-to-choose')).toEqual({ page: 'dad-allinone-how-to-choose', link: 'product_box' });
  });
  it('sends nothing extra elsewhere or for other actions', () => {
    expect(journalClickData('journal_letter_link_clicked', '/journal/other')).toBeNull();
    expect(journalClickData('letter_entry_clicked', '/journal/after-shave-gift')).toBeNull();
  });
});
