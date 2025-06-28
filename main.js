const { Actor } = require('apify');

Actor.main(async () => {
    const input = await Actor.getInput();
    const { startUrl } = input;

    const page = await Actor.createPuppeteerPage();
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

    await Actor.pushData(members);
});
