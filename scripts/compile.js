// npx js-yaml syntaxes/4gl.tmLanguage.yaml > syntaxes/4gl.tmLanguage.json

const yaml = require("js-yaml")
const fs = require("fs")

// 

try {
    var sourceDic = JSON.parse(fs.readFileSync("./scripts/compile.json",'utf-8'))
    for (const k in sourceDic) {
        var config = yaml.safeLoad(fs.readFileSync(sourceDic[k].srcfile,'utf-8'))
        var indentJson = JSON.stringify(config,null,4)
        fs.writeFileSync(sourceDic[k].tarfile,indentJson,'utf-8')
    };
    // var config = yaml.safeLoad(fs.readFileSync('./syntaxes/4gl.tmLanguage.yaml','utf-8'))
    // var indentJson = JSON.stringify(config,null,4)
    // fs.writeFileSync("./syntaxes/4gl.tmLanguage.json",indentJson,'utf-8')
    console.log("done")
} catch (e){
    console.log(e)
} finally {
    fs.close
}