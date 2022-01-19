import axios from "axios";
let baseURL = 'https://f3d-shop.forgeflow.io/' //website url to parse
let host = /f3d-shop.forgeflow.io/


let depth = 1
let urlsToParse = new Set()
urlsToParse.add(baseURL)

//Starts the process
// axios.get('https://lulzbot.com')
//     .then(html => console.log(html))

async function getURL(url){
    let html = await axios.get(url)
    let htmlBody = removeHeader(html.data)
    let urlArray = findURLS(htmlBody)
    addURLToSet(urlArray)
    console.log(urlsToParse)
}

function removeHeader(htmlString){
    let regex = /<body/
    let bodyIndex = htmlString.search(regex)
    return htmlString.substring(bodyIndex)
}

function findURLS(htmlString){
    let regex = /href=".+?"/g
    let array = [ ...htmlString.matchAll(regex)]
    return array
}

function addURLToSet(urlArray){
    //remove href=" && "$
    let httpsRegex = /https:\/\//
    urlArray.forEach(url => {
        let finalURL = url[0].substring(6, url[0].length-1)
        if((finalURL.match(httpsRegex) && finalURL.match(host)) || finalURL[0] == "/"){
            urlsToParse.add(finalURL)
        } else{
        }
    })
}

// getURL(baseURL)

let string = '<a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><img src="https://f3d-shop.forgeflow.io/sites/5ea1795e2cee8d0001d7d424/assets/61d907d9abd8e03f7ad2f268/lulzbotsprinters.jpg" alt=""><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a><a href="someurls/.,sd/aks"></a>'
// console.log(findURLS(string))

function findImages(htmlString){
    let imageRegex = /<img.+?>/g
    let imageArray = [ ...htmlString.matchAll(imageRegex)]
    // Parse the sre attribut
    imageArray.forEach(imageElement => {
        imageElement[0] = imageElement[0].substring(10, imageElement[0].length)
        let urlEnd = imageElement[0].search(/"/)
        imageElement[0] = imageElement[0].substring(0, urlEnd)
    })
    return imageArray
}

async function parseImageSize(imageURL){
    let response = await axios.get(imageURL)
    let image = {
        size: response.headers["content-length"],
        type: response.headers["content-type"]
    }
    console.log(image)
    return image
}

console.log(findImages(string))
