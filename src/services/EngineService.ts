import fs = require('fs');
import { Word } from '../model/Word';
import { TypedEvent } from '../model/TypedEvent';
import { NewWordEvent } from '../model/NewWordEvent';

export enum EngineState {
    UNINITIALISED,
    INPUT_CORRECT,
    INPUT_INCORRECT,
    WORD_CORRECT
}

export class EngineService {
    wordList: Word[];
    word: string;
    wordIndex: number = 0;
    activeIndex: number = 0;
    state: EngineState = EngineState.UNINITIALISED;
    private newWordEvent: TypedEvent<NewWordEvent> = new TypedEvent();

    loadWords(jsonPath: string) {
        try {
            const jsonStr = fs.readFileSync(jsonPath, 'utf8');
            const json = JSON.parse(jsonStr);
            this.wordList = json.words;
            this.newGame();
        } catch (e) {
            console.error("Error while loading word list.", e);
        }
    }

    newGame() {
        this.wordIndex = 0;
        this.newWord();
    }

    newWord() {
        this.activeIndex = 0;
        this.word = this.wordList[this.wordIndex].text;
        this.emitNewWord(this.word);
    }

    onNewWord(callback: Function) {
        this.newWordEvent.onEventTriggered((event: NewWordEvent) => callback(event));
    }

    emitNewWord(word: string) {
        this.newWordEvent.emit({ 
            word: word
        });
    }

    processInput(input: string): EngineState {
        const activeChar: string = this.word.substr(this.activeIndex, 1);
        const isCorrect = (activeChar.toLowerCase() === input);
        if (isCorrect) {
            if (this.activeIndex < this.word.length-1) {
                this.activeIndex ++;
                return EngineState.INPUT_CORRECT;
            } else {
                this.wordIndex += 1;
                if (this.wordIndex >= this.wordList.length) {
                    this.newGame();
                } else {
                    this.newWord();
                }
                return EngineState.WORD_CORRECT;
            }
        } 
        return EngineState.INPUT_INCORRECT;
    }
}