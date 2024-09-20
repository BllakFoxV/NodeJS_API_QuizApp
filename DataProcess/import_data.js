import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import Question from '../src/models/Question.mjs';

const dataFolder = path.join(process.cwd(),"DataProcess" ,'data');

let processCount = 0;
let successCount = 0;
let failCount = 0;
let areadyExist = 0;
let errorQuests = [];

function preProcessText(text) {
    while(text.includes('\n')){
        text = text.replace('\n','');
    }
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.replace('đáp án', 'Đáp án');
    text = text.replace('Đáp an', 'Đáp án');
    text = text.trim();
    return text;
}

async function processDocxFile(filePath) {
    const { value } = await mammoth.extractRawText({ path: filePath });
    const filterValue = preProcessText(value);
    const questions = filterValue.split(/Câu \d+\./g).slice(1);

    for (const questionText of questions) {
        const textProcessed = preProcessText(questionText);
        processCount++;
        // const match = textProcessed.match(/^(.*?)\s*(?:A\.\s*(.*?)\s*B\.\s*(.*?)\s*C\.\s*(.*?)\s*D\.\s*(.*?)\s*)Đáp án\s*(\w)/s);
        // const match = textProcessed.match(/^(.*?)(?:[A-D]\..*?){2,4}\s*Đáp án\s*([A-D])/s);
        const match = textProcessed.match(/^(.*?)\s*(?:\(.*?\))?\s*A\.\s*(.*?)\s*B\.\s*(.*?)\s*(?:C\.\s*(.*?))?\s*(?:D\.\s*(.*?))?\s*Đáp án\s*([A-D])/s);
        if (match) {
            const [, text, optionA, optionB, optionC, optionD, correctAnswer] = match;
            const question = new Question(
                text.trim(),
                optionA.trim(),
                optionB.trim(),
                optionC ? optionC.trim() : "",
                optionD ? optionD.trim() : "",
                correctAnswer.trim()
            );
            
            // Test
            // console.log(question.options);
            // console.log(question);
            // continue;
            try {
                const exist_quest = await Question.findByText(question.text);
                if (exist_quest) {
                    areadyExist++;
                    // console.log(`Question already exists: ${text.trim()}`);
                    continue;
                }
                await question.save();
                successCount++;
                // console.log(`Added question: ${text.trim()}`);
            } catch (error) {
                console.log(`Failed to add question: ${text.trim()}`, error);
            }
        } else {
            failCount++;
            console.log(`\nFailed to parse question: \n${textProcessed}\n`);
            errorQuests.push(textProcessed);
        }
    }
    return questions.length;
}

async function importData() {
    try {
        let countQuestionsPerfile = [];
        const files = await fs.readdir(dataFolder);
        const docxFiles = files.filter(file => path.extname(file).toLowerCase() === '.docx');

        for (const file of docxFiles) {
            const filePath = path.join(dataFolder, file);
            const countQuestions = await processDocxFile(filePath);
            countQuestionsPerfile.push(`${file}: ${countQuestions} questions`);
            // return;
        }

        
        console.log('Data import completed');
        
        console.log('\nImport Summary:');
        console.log('┌─────────────────┬───────────┐');
        console.log('│ Category        │ Count     │');
        console.log('├─────────────────┼───────────┤');
        console.log(`│ Processed       │ ${processCount.toString().padStart(9)} │`);
        console.log(`│ Added           │ ${successCount.toString().padStart(9)} │`);
        console.log(`│ Failed          │ ${failCount.toString().padStart(9)} │`);
        console.log(`│ Already Exist   │ ${areadyExist.toString().padStart(9)} │`);
        console.log('└─────────────────┴───────────┘');
        

        // Save errorQuests to error.log file
        if (errorQuests.length > 0) {
            const errorLogPath = path.join(process.cwd(), 'DataProcess', 'error.log');
            const errorLog = errorQuests.join('\n\n---\n\n');
            await fs.writeFile(errorLogPath, errorLog, 'utf-8');
            console.log(`\nFailed questions saved to: ${errorLogPath}`);
        }

        console.log('\nCount questions per file:');
        console.log(countQuestionsPerfile);

    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        process.exit(0);
    }
}

importData();
