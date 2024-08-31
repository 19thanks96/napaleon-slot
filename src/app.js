import {
    Application,
    Assets,
    Color,
    Container,
    Texture,
    Sprite,
    Graphics,
    Text,
    TextStyle,
    BlurFilter,
    FillGradient,
} from 'pixi.js';



const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
let app
let slotTextures;

async function initializeApplication() {
    app = new Application();
    globalThis.__PIXI_APP__ = app;

    // Initialize the application
    await app.init({background: '#1099bb', resizeTo: window - 500});

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the textures
    await Assets.load([
        'https://pixijs.com/assets/eggHead.png',
        'https://pixijs.com/assets/flowerTop.png',
        'https://pixijs.com/assets/helmlok.png',
        'https://pixijs.com/assets/skully.png',
    ]);

    slotTextures = [
        Texture.from('https://pixijs.com/assets/eggHead.png'),
        Texture.from('https://pixijs.com/assets/flowerTop.png'),
        Texture.from('https://pixijs.com/assets/helmlok.png'),
        Texture.from('https://pixijs.com/assets/skully.png'),
    ];


}

(async () => {
    await initializeApplication();

    const reel1 = [0, 1, 2, 3, 0, 1]
    const reel2 = [0, 1, 2, 3, 0, 2]
    const reel3 = [0, 1, 2, 3, 0, 3]
    const reel4 = [0, 1, 2, 3, 0, 0]
    const reel5 = [0, 1, 2, 3, 0, 1]
    let reelsSymbols = [reel1, reel2, reel3, reel4, reel5];

    // Build the reels
    let reels = [];
    const reelContainer = new Container();

    function createSlotElements(reelsNewSymbols, newPositionY) {
        if (reelsNewSymbols) {
            reelsSymbols = reelsNewSymbols;
        }
        for (let i = 0; i < 5; i++) {
            const rc = new Container();

            rc.x = i * REEL_WIDTH;
            reelContainer.addChild(rc);

            const reel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new BlurFilter(),
            };

            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];
            // Build the symbols
            for (let j = 0; j < 4; j++) {
                const symbol = new Sprite(slotTextures[reelsSymbols[i][j]]);
                // Scale the symbol to fit symbol area.

                if (newPositionY) {
                    symbol.y = j * SYMBOL_SIZE + newPositionY;
                } else {
                    symbol.y = j * SYMBOL_SIZE;

                }

                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                symbol.isOutOfScreen = false
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }

            reels.push(reel);

        }
    }

    createSlotElements()
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    const top = new Graphics().rect(0, 0, app.screen.width, margin).fill({color: 0x0});
    const bottom = new Graphics().rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin).fill({color: 0x0});

    // Create gradient fill
    const fill = new FillGradient(0, 0, 0, 36 * 1.7);

    const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());

    colors.forEach((number, index) => {
        const ratio = index / colors.length;

        fill.addColorStop(ratio, number);
    });

    // Add play text
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: {fill},
        stroke: {color: 0x4a1850, width: 5},
        dropShadow: {
            color: 0x000000,
            angle: Math.PI / 6,
            blur: 4,
            distance: 6,
        },
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const playText = new Text('Spin the wheels!', style);
    let bid = 10
    const balance = new Text ('1000', style);
    balance.x =  Math.round((bottom.width - balance.width) );
    balance.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);

    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(balance);
    bottom.addChild(playText);


    app.stage.addChild(top);
    app.stage.addChild(bottom);

    // Set the interactivity.
    bottom.eventMode = 'static';
    bottom.cursor = 'pointer';
    bottom.addListener('pointerdown', () => {
        startPlay(bid);
    });

    let running = false;

    function startPlay(bid) {
        if (running) return;
        running = true;
        let withdrawingMoneyInterval =  setInterval(() => {
            if (bid > 0) {
                bid -= 1
                balance.text -= 1
            } else {
                clearInterval(withdrawingMoneyInterval);
            }
        }, 50);

    }

    const reeelsHeight = reelContainer.height

    // Reels done handler.
    function reelsComplete() {
        isCreateNewSlotElements = false
        for (let r = 0; r < reels.length; r++) {
            reels[r].container.y = 0
            for (let j = 0; j < reels.length -1; j++) {
                reels[r].symbols[j].y = j * REEL_WIDTH;
            }
        }
        running = false;

    }

    function  removeReels (maxIteration) {
        for (let k = 0; k < maxIteration; k++) {
            reelContainer.removeChild(reels[k].container);
        }
    }


    let isCreateNewSlotElements = false
    app.ticker.add(() => {
        // Update the slots.
        let checkerOneStart = false
        let velocity = 5
        const reel1 = [1, 1, 2, 3, 0, 1]
        const reel2 = [1, 1, 1, 3, 0, 2]
        const reel3 = [1, 1, 2, 3, 0, 3]
        const reel4 = [1, 1, 1, 3, 0, 0]
        const reel5 = [1, 1, 2, 3, 0, 1]
        const reelsSymbols = [reel1, reel2, reel3, reel4, reel5];

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];

            for (let j = 0; j < r.symbols.length; j++) {
                if (running) {
                    reels[i].container.y += velocity
                    const s = r.symbols[j];
                    const firstElement = reels[0].symbols[0].y


                    //circular rotate reels
                    if (reels[i].container.y > reeelsHeight) {



                        if (!isCreateNewSlotElements) {
                            removeReels(reelContainer.children.length)
                            reels = []

                            createSlotElements(reelsSymbols, -reeelsHeight)
                            isCreateNewSlotElements = true
                        } else {

                            reelsComplete()
                        }
                    }
                }
            }
        }
    });

})();
