var fs = require("fs");
var CodeGen = require("swagger-typescript-codegen").CodeGen;
 
var file = "swagger/spec.json";
var swagger = JSON.parse(fs.readFileSync(file, "UTF-8"));
var tsSourceCode = CodeGen.getTypescriptCode({
  className: "Test",
  swagger: swagger
});
fs.writeFile('types/client.ts', tsSourceCode, (err) => {
    if (err) throw err;
    console.log('Typescript client written');
});