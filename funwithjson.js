const fs = require("fs");


const xlsx = require("xlsx");



// console.log(data);

let Stringdata = JSON.stringify(data);

console.log(Stringdata);

fs.writeFileSync("./example.json", Stringdata);

function ExcelWrite(filepath,data,sheetname)
{
    let newWB = xlsx.utils.book_new();
    // add new work book
    let newWS = xlsx.utils.json_to_sheet(data);
    // it will take JSON and will convert in to excel format
    xlsx.utils.book_append_sheet(newWB, newWS,sheetname);
    xlsx.writeFile(newWB, filepath);
}

// for reading the data
function ExcelReader(filepath,sheetname)
{
     if(fs.existsSync(filepath)==false)
     {
         return [];
     }
    let wb = xlsx.readFile(filepath);
    // which excel file read 
    let excelData = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return;
    // console.log(ans);
}
