// Create a script that uses the Node.js core fs.writeFile() (callback API) method to write a text file. 
//The documentation for this method is on the Node.js File system page.
import { writeFile } from 'node:fs';

writeFile('file.txt', 'Sono il testo del file', (error) => {
  if (error){
    console.log(error);
    return
  }
  console.log('The file has been saved!');
});
