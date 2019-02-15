import { Titlebar, Color } from 'custom-electron-titlebar';
import { EngineService, EngineState } from '../services/EngineService';
import 'mousetrap';
import { NewWordEvent } from '../model/NewWordEvent';

new Titlebar({
    backgroundColor: Color.fromHex('#444'),
    minimizable: false,
});

class BoardRenderer {
    readonly WORDS_PATH: string = 'resources/words.json';

    private engine: EngineService = new EngineService();
    private word: Element = document.getElementById("word");
    private supportedChars: string = 'abcdefghijklmnopqrstuvwxyz';
    private boundCharacters: string[] = [... this.supportedChars];

    constructor() {
        this.initialize();
    }

    onKeyPressed(key: string): void {
        const state: EngineState = this.engine.processInput(key);
        const previous = this.word.getElementsByTagName("span")[this.engine.getActiveIndex() - 1];
        const active = this.word.getElementsByTagName("span")[this.engine.getActiveIndex()];
        if (state == EngineState.INPUT_CORRECT) {
            previous.classList.remove('active');
            previous.classList.add('done');
            active.classList.add('active');
        }
    }

    bindKeys(): void {
        this.boundCharacters.forEach(key => {
            Mousetrap.bind(key, () => this.onKeyPressed(key));
        });
    }

    initialize(): void {
        this.bindKeys();
        this.engine.loadWords(this.WORDS_PATH);
        this.engine.onNewWord((newWordEvent: NewWordEvent) => {
            this.renderWord(newWordEvent.word);
        });
        this.engine.newGame();
    }

    renderWord(word:string): void {
        this.word.innerHTML = "";
        const charList: string[] = [... word];
        charList.forEach((char) => {
            const span = document.createElement('span');
            span.innerText = char;
            this.word.appendChild(span);
        });
        if (this.word.children.length > 0) {
            this.word.children[0].className = "active";
        }
    }
}
export default new BoardRenderer();
