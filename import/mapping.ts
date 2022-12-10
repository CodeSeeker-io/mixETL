import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const createMap = (input: string[]) => {};

const getInput = async (): Promise<string[]> => {
  const input: string[] = [];
  const rl = readline.createInterface(stdin, stdout);
  const questions: string[] = [
    'What is the name of your event column?',
    'What is the name of your distinct_id column?',
    'Do you have a time column?',
    'What is the name of your event column?',
  ];
  let answer: string;
  for (let i = 0; i < questions.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    answer = await rl.question(`${questions[i]} \t`);
    input.push(answer);
  }
  rl.close();
  return input;
};

export { createMap, getInput };
