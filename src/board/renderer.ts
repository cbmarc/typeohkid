import { Titlebar, Color } from 'custom-electron-titlebar';
import { EngineService, EngineState } from '../services/engine.service';
import 'mousetrap';

new Titlebar({
    backgroundColor: Color.fromHex('#444'),
    minimizable: false,
});

class BoardRenderer {
    engine: EngineService = new EngineService();
    word: Element = document.getElementById("word");
    supportedChars: string = 'abcdefghijklmnopqrstuvwxyz';
    boundCharacters: string[] = [... this.supportedChars];
    
    constructor() {
        this.engine.word = "ALEIX";
        this.initialize();
    }

    onKeyPressed(key: string): void {
        const state: EngineState = this.engine.processInput(key);
        const previous = this.word.getElementsByTagName("span")[this.engine.activeIndex - 1];
        const active = this.word.getElementsByTagName("span")[this.engine.activeIndex];
        if (state == EngineState.INPUT_CORRECT) {
            previous.classList.remove('active');
            previous.classList.add('done');
            active.classList.add('active');
        } else if (state == EngineState.WORD_CORRECT) {
            active.classList.remove('active');
            active.classList.add('done');
        }
    }

    bindKeys(): void {
        this.boundCharacters.forEach(key => {
            Mousetrap.bind(key, () => this.onKeyPressed(key));
        });
    }

    initialize(): void {
        this.bindKeys();
    }

    renderWord(word:string): void {

    }
}
export default new BoardRenderer();
