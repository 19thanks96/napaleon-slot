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


(async () => {
    // Create a new application
    const app = new Application();

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

    const REEL_WIDTH = 160;
    const SYMBOL_SIZE = 150;

    // Create different slot symbols
    const slotTextures = [
        Texture.from('https://pixijs.com/assets/eggHead.png'),
        Texture.from('https://pixijs.com/assets/flowerTop.png'),
        Texture.from('https://pixijs.com/assets/helmlok.png'),
        Texture.from('https://pixijs.com/assets/skully.png'),
    ];
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
        if(reelsNewSymbols) {
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
                } else{
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

    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);


    app.stage.addChild(top);
    app.stage.addChild(bottom);

    // Set the interactivity.
    bottom.eventMode = 'static';
    bottom.cursor = 'pointer';
    bottom.addListener('pointerdown', () => {
        startPlay();
    });

    let running = false;

    // Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;


        }
    }

    const reeelsHeight = reelContainer.height

    // Reels done handler.
    function reelsComplete() {
        running = false;
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


            // console.log(reels)
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;
            // console.log(reels[0].symbols[0].y)
            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                if (running) {
                    reels[i].container.y  += velocity
                    const s = r.symbols[j];
                    const firstElement = reels[0].symbols[0].y
                        // s.y += velocity;

                    //circular rotate reels
                    if (reels[i].container.y > reeelsHeight) {
                        // reels[i].symbols[j].y = -SYMBOL_SIZE


                        if(!isCreateNewSlotElements) {
                            reels = []
                            createSlotElements(reelsSymbols, -reeelsHeight)
                            isCreateNewSlotElements = true
                        } else {
                            running = false
                        }
                    }
                    // if(reels[0].symbols[0].isOutOfScreen) {
                    //     reels = []
                    //
                    //     if(!isCreateNewSlotElements) {
                    //     createSlotElements(reelsSymbols, -reeelsHeight)
                    //         isCreateNewSlotElements = true
                    //     }
                    // }

                    // if(reels[0].symbols[3].isOutOfScreen && isCreateNewSlotElements) {
                    //     running = false
                    // }
                } else {


                }
            }
        }
    });

})();
