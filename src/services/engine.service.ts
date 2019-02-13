export enum EngineState {
    UNINITIALISED,
    INPUT_CORRECT,
    INPUT_INCORRECT,
    WORD_CORRECT
}

export class EngineService {
    word: string;
    activeIndex: number = 0;
    state: EngineState = EngineState.UNINITIALISED;
    processInput(input: string): EngineState {
        const activeChar: string = this.word.substr(this.activeIndex, 1);
        const isCorrect = (activeChar.toLowerCase() === input);
        if (isCorrect) {
            if (this.activeIndex < this.word.length-1) {
                this.activeIndex ++;
                return EngineState.INPUT_CORRECT;
            } else {
                return EngineState.WORD_CORRECT;
            }
        } 
        return EngineState.INPUT_INCORRECT;
    }
}