const fs = require('fs');
const path = require('path');

const files = [
    { json: 'anime.json', md: 'anime.md', heading: '見たアニメ' },
    { json: 'game.json', md: 'game.md', heading: 'プレイしたゲーム' },
    { json: 'manga.json', md: 'manga.md', heading: '読んだ漫画' },
    { json: 'movie.json', md: 'movie.md', heading: '見た映画' }
];

files.forEach(file => {
    const jsonFilePath = path.join(__dirname, '..', 'data', file.json);
    const mdFilePath = path.join(__dirname, '..', 'md', file.md);

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${jsonFilePath}:`, err);
            return;
        }

        let itemList;
        try {
            itemList = JSON.parse(data);
        } catch (parseErr) {
            console.error(`Error parsing JSON from file ${jsonFilePath}:`, parseErr);
            return;
        }

        if (!Array.isArray(itemList)) {
            console.error(`Error: JSON data in file ${jsonFilePath} is not an array`);
            return;
        }

        const markdown = generateMarkdown(itemList, file.heading);

        fs.writeFile(mdFilePath, markdown, (err) => {
            if (err) {
                console.error(`Error writing file ${mdFilePath}:`, err);
                return;
            }
            console.log(`Markdown file ${mdFilePath} has been saved.`);
        });
    });
});

function generateMarkdown(itemList, heading) {
    const years = {};
    itemList.forEach(item => {
        if (!years[item.year]) {
            years[item.year] = [];
        }
        years[item.year].push(item.title);
    });

    let markdown = `# ${heading}\n\n計${itemList.length}作品\n\n`;
    const sortedYears = Object.keys(years).sort((a, b) => b - a);
    sortedYears.forEach(year => {
        markdown += `## ${year}年\n\n`;
        const sortedTitles = years[year].sort();
        sortedTitles.forEach(title => {
            markdown += `- ${title}\n`;
        });
        markdown += "\n";
    });

    return markdown;
}
