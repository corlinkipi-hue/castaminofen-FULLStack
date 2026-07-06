describe('RSS feed import contract', () => {
  const sampleRssXml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>نمونه فید پادکست</title>
      <link>https://example.com/rss</link>
      <description>فید تست برای بررسی واردسازی آیتم‌ها</description>
      <item>
        <title><![CDATA[پادکست اول]]></title>
        <link>https://example.com/episodes/1</link>
        <pubDate>Mon, 01 Jul 2024 10:00:00 GMT</pubDate>
      </item>
      <item>
        <title><![CDATA[پادکست دوم]]></title>
        <link>https://example.com/episodes/2</link>
        <pubDate>Tue, 02 Jul 2024 10:00:00 GMT</pubDate>
      </item>
    </channel>
  </rss>`;

  const parseRssFeedItems = (xml: string) => {
    const itemBlocks = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));

    return itemBlocks.map(([, block]) => {
      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ?? block.match(/<title>(.*?)<\/title>/);
      const linkMatch = block.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);

      return {
        title: titleMatch?.[1]?.trim() ?? '',
        link: linkMatch?.[1]?.trim() ?? '',
        pubDate: pubDateMatch?.[1]?.trim() ?? '',
      };
    });
  };

  it('extracts titles, links, and publication dates from a sample RSS feed', () => {
    const items = parseRssFeedItems(sampleRssXml);

    expect(items).toHaveLength(2);
    expect(items[0]).toEqual(
      expect.objectContaining({
        title: 'پادکست اول',
        link: 'https://example.com/episodes/1',
        pubDate: 'Mon, 01 Jul 2024 10:00:00 GMT',
      }),
    );

    expect(items[1]).toEqual(
      expect.objectContaining({
        title: 'پادکست دوم',
        link: 'https://example.com/episodes/2',
      }),
    );

    expect(items.every((item) => item.link.length > 0)).toBe(true);
  });
});
