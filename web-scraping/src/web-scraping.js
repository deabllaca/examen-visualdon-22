import jsdom from "jsdom";
import fetch from "isomorphic-fetch"
import puppeteer from "puppeteer"


const wikipedia_url = "https://fr.wikipedia.org/wiki/Liste_des_lacs_de_Suisse";


/*
========================================================================================================================
Capture d’écran
========================================================================================================================
*/

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1720 }
    });
    const page = await browser.newPage();
    await page.goto(wikipedia_url);
    await page.screenshot({ path: 'img/screen.png' });

    await browser.close();
})();





/*
========================================================================================================================
Noms des lacs Suisses
========================================================================================================================
*/


(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(wikipedia_url)

    const lacs = await page.$$eval('td span', (nodes) =>
        nodes.map((n) => n.innerText)
    )
    console.log(lacs)
    await browser.close()
})()




    /*
    ========================================================================================================================
    Nom du lac le plus profond
    ========================================================================================================================
    */


    // filtrer le lac ayant la profondeur la plus basse 
    const lac_le_plus_profond = lacs.filter(lac => lac.profondeur === Math.min(...lacs.map(lac => lac.profondeur)))
    console.table(lac_le_plus_profond)

    // récupérer les lacs les plus profonds de Suisse

    // (async () => {
    //     const browser = await puppeteer.launch();

    //     const page = await browser.newPage();
    //     await page.goto(wikipedia_url)

    //     const lacs = await page.$$eval('td th', (nodes) => nodes.map((n) => n.innerText))
    //     // const lacs_profonds = lacs.filter(lac => lac.includes("profond"))
    //     console.log(lacs)

    //     await browser.close()

    // })()

/*
========================================================================================================================
Nom du lac le plus grand
========================================================================================================================
*/

// récupérer le lac le plus grand de Suisse (en mètres)

    // (async () => {
    //     const browser = await puppeteer.launch();

    //     const page = await browser.newPage();
    //     await page.goto(wikipedia_url)

    //     const lacs = await page.$$eval('td th', (nodes) => nodes.map((n) => n.innerText))
    //     const lac_plus_grand = lacs.filter(lac => lac.includes("grand"))
    //     console.log(lac_plus_grand)

    //     await browser.close()

    // }   )();