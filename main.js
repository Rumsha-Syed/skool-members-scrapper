import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();
const { startUrl } = input;

const results = [];

const crawler = new PuppeteerCrawler({
    requestHandler: async ({ page }) => {
        await page.goto(startUrl, { waitUntil: 'networkidle2' });
        await page.waitForSelector('[class*="member-name"]');

        const members = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('[class*="member-name"]'));
            return elements.map(el => {
                const name = el.innerText.trim();
                const [firstName = '', lastName = ''] = name.split(' ');
                return { firstName, lastName };
            });
        });

        results.push(...members);
    },
    maxRequestsPerCrawl: 1,
    headless: true,
});

await crawler.run([{ url: startUrl }]);

await Actor.pushData(results);
await Actor.exit();
