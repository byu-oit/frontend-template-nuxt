const fs = require('fs')
const CodeGen = require('swagger-typescript-codegen').CodeGen

const file = 'swagger/spec.json'
const swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'))
const tsSourceCode = CodeGen.getTypescriptCode({
  className: 'Test',
  swagger
})
fs.writeFile('types/client.ts', tsSourceCode, (err) => {
  if (err) { throw err }
  console.log('Typescript client written')
})
