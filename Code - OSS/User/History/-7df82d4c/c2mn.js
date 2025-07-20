const fs = require('fs');
const path = require('path');

// Function to count words in a file
function countWordsInFile(filePath) {
    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Split the content into words using a regular expression
        const words = data.match(/\b\w+\b/g);
        const wordCount = words ? words.length : 0;

        console.log(`Total number of words: ${(wordCount / 2) - 354}`);
    });
}

// Specify the path to your text file
const filePath = path.join(__dirname, 'markdown.md'); // Replace 'yourfile.txt' with your file name
countWordsInFile(filePath);
