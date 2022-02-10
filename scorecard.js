// const url='https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const cheerio = require("cheerio");

const request = require("request");



const path = require("path");

const fs = require("fs");

const xlsx=require('xlsx')

function processScoreCard(url) {
  request(url, cb);
}

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractMatch(html);
  }
}

function extractMatch(html) {
  let $ = cheerio.load(html);

  let descriEle = $(".header-info .description");

  // console.log(descriEle.text());
  let result = $(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span"
  ).text();
  let StrArr = descriEle.text().split(",");

  //   for(let i=0;i<StrArr.length;i++)
  //   {
  //       console.log(StrArr[i].trim());
  //   }
  let venue = StrArr[1].trim();

  let date = StrArr[2].trim();

  // let result = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span')
  console.log(venue);
  console.log(date);
  console.log(result);

  console.log(
    "*************************************************************************"
  );

  let inning = $(".card.content-block.match-scorecard-table>.Collapsible");

  let htmlString = ""; // empty String

  for (let i = 0; i < inning.length; i++) {
    htmlString += $(inning[i]).html();

    let TeamName = $(inning[i]).find("h5").text();

    TeamName = TeamName.split("INNINGS")[0].trim();

    let opponentindex = i == 0 ? 1 : 0;

    let opponentname = $(inning[opponentindex]).find("h5").text();

    opponentname = opponentname.split("INNINGS")[0].trim();

    let cinning = $(inning[i]);

    let Allrow = cinning.find(".table.batsman tbody tr");

    for (let j = 0; j < Allrow.length; j++) {
      let allcols = $(Allrow[j]).find("td");

      let isworthy = $(allcols[0]).hasClass("batsman-cell");

      if (isworthy == true) {
        let playername = $(allcols[0]).text().trim();
        let runs = $(allcols[2]).text().trim();
        let balls = $(allcols[3]).text().trim();
        let fours = $(allcols[5]).text().trim();
        let sixes = $(allcols[6]).text().trim();

        let strike = $(allcols[7]).text().trim();

        console.log(
          `${playername} | ${runs} | ${balls} | ${fours} | ${sixes} | ${strike}`
        );
        ProcessPlayer(
          TeamName,
          playername,
          runs,
          balls,
          fours,
          sixes,
          strike,
          opponentname,
          venue,
          date,
          result
        );
      }
    }

    console.log(
      "*****************************************************************"
    );
    // console.log(venue,date,TeamName,opponentname,result);
  }
}
  function ProcessPlayer(
     TeamName,
    playername,
    runs,
    balls,
    fours,
    sixes,
    strike,
    opponentname,
    venue,
    date,
    result )
     
    {
            let teampath=path.join(__dirname,"IPL", TeamName)
            dirCreater(teampath)

            let filePath=path.join(teampath,playername+'.xlsx')

            let content=ExcelReader(filePath,playername)

            let playerObj=
            {
                TeamName,
                playername,
                runs,
                balls,
                fours,
                sixes,
                strike,
                opponentname,
                venue,
                date,
                result                
            }
            
            content.push(playerObj)
            ExcelWrite(filePath,content,playername)
            
  }

  function dirCreater(filepath) {
    if (fs.existsSync(filepath) == false) {
      fs.mkdirSync(filepath);
    }
  }
  function ExcelWrite(filepath, data, sheetname) {
    let newWB = xlsx.utils.book_new();
    // add new work book
    let newWS = xlsx.utils.json_to_sheet(data);
    // it will take JSON and will convert in to excel format
    xlsx.utils.book_append_sheet(newWB, newWS, sheetname);
    xlsx.writeFile(newWB, filepath);
  }

  // for reading the data
  function ExcelReader(filepath, sheetname) {
    if (fs.existsSync(filepath) == false) {
      return [];
    }
    let wb = xlsx.readFile(filepath);
    // which excel file read
    let excelData = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
    // console.log(ans);
  }
module.exports = {
  ps: processScoreCard,
};
