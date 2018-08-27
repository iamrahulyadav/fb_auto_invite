const puppeteer = require('puppeteer');
const { user, password } = require(process.cwd() + '/credentials.js');
const facebookPage = process.argv[2];
const jsExecute = `
function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

Array.prototype.asyncForEach = async function asyncForEach(callback) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[index], index, this)
  }
}

async function clickElement(element) {
    element.click();
    await delay(1000);
    return Promise.resolve(true);
}

async function inviteAll() {
    let inviteElements = Array.from(document.querySelectorAll('#reaction_profile_browser a')).filter( link => link.text === 'Uitnodigen' );
    await inviteElements.asyncForEach( async element => {
	console.log("clicking on invite");
	await clickElement(element);
        return Promise.resolve(true);
    } );
    return Promise.resolve(true);
}

async function viewMore() {
    let moreButton = document.querySelector('#reaction_profile_pager a.uiMorePagerPrimary');
    if (moreButton != null) {
	console.log("clicking on more");
        moreButton.click();
        setTimeout(async () => {
            await inviteAll();
            await viewMore();
        }, 3000);
    }
    await inviteAll();
    return new Promise((resolve, reject) => resolve(true));
}

function clickCancel() {
    console.log("Close like screen");
  return new Promise( (resolve) => {
    setTimeout(() => {
         document.querySelector('.layerCancel').click();
         resolve(true);
    }, 2000);
  });
}

async function checkAll() {
    const likeElements = Array.from(document.querySelectorAll('.userContentWrapper form a[href^="/ufi/reaction/profile"][rel="ignore"] '));
    await likeElements.asyncForEach( async (element) => {
	console.log("Clicking on likes");
	element.click();
        await delay(10000);
	await viewMore();
        await delay(1000);
        await clickCancel();
        return Promise.resolve(true);
    });
    return Promise.resolve(true);
}

checkAll();
`;

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

(async () => {
    const executablePath = process.pkg ?
    puppeteer.executablePath().replace(__dirname, '.') :
    puppeteer.executablePath();
    const browser = await puppeteer.launch({
        executablePath,
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications']
    });
    const page = await browser.newPage();
    let login = async () => {
        // login
        await page.goto('https://facebook.com', {
            waitUntil: 'networkidle2'
        });

        await page.waitForSelector('#email');
        await page.type('#email', user);

        await page.type('#pass', password);
        await delay(500);

        await page.click("#loginbutton");

        console.log("login done");
        await page.waitForNavigation();
    };
    await login();
    await page.goto(`https://www.facebook.com/${facebookPage}/`, {
	waitUntil: 'domcontentloaded'
    });
    await delay(1000);
    let scroll = async () => {
        page.evaluate(_ => {
            window.scrollBy(0, window.innerHeight);
        });
    };
    await scroll();
    await delay(2000);
    await scroll();
    await delay(2000);
    await scroll();
    await delay(2000);
    await scroll();
    await scroll();
    await delay(4000);
    await page.evaluate(jsExecute);
    await delay(20000);
    await browser.close();
})();
