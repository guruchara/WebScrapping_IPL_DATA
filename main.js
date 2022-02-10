
const url='https://www.espncricinfo.com/series/ipl-2020-21-1210595'

const request=require('request')
 
const path=require('path')

const iplpath=path.join(__dirname,"IPL")

const cheerio=require('cheerio')

const allMatchObj = require('./allmethod.js')

const fs=require('fs')
// const scorecard = require('./scorecard.js')
dirCreater(iplpath)
request(url,cb)

function cb(error,response,html)
{
    if(error)
    {
        console.log('error');
    }
    else{
        extractAllMatchLink(html)
    }
}

function extractAllMatchLink(html)
{
    let $=cheerio.load(html)

    let anchorElement=$('a[data-hover="View All Results"]')

    let link=anchorElement.attr('href')

    let fullLink='https://www.espncricinfo.com/'+link

   
allMatchObj.getAllMatch(fullLink);

}

function dirCreater(filepath)
{
    if(fs.existsSync(filepath)==false)
    {
        fs.mkdirSync(filepath)
    }
}

