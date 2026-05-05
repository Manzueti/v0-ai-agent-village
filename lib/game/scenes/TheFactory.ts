import Phaser from 'phaser';

class TinyRobot extends Phaser.GameObjects.Container {
    private body: Phaser.GameObjects.Graphics;
    private eye: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y);

        // Robot Body - Sleek geometric shape
        this.body = scene.add.graphics();
        this.body.fillStyle(0x333333, 1);
        this.body.fillRoundedRect(-12, -15, 24, 30, 4);
        this.body.lineStyle(2, color, 0.8);
        this.body.strokeRoundedRect(-12, -15, 24, 30, 4);

        // Robot Eye - Glowing
        this.eye = scene.add.graphics();
        this.eye.fillStyle(color, 1);
        this.eye.fillCircle(0, -5, 4);
        
        // Add FX to eye for "AI feel"
        if (scene.cameras.main.renderList.length > 0) { // Check if WebGL is likely
            this.eye.postFX.addGlow(color, 2, 0, false, 0.1, 10);
        }

        // Antenna
        const antenna = scene.add.graphics();
        antenna.lineStyle(1, 0x888888, 1);
        antenna.lineBetween(0, -15, 0, -22);
        antenna.fillStyle(color, 1);
        antenna.fillCircle(0, -22, 2);

        this.add([this.body, this.eye, antenna]);
        scene.add.existing(this);
    }

    setMoving(isMoving: boolean) {
        if (isMoving) {
            this.scene.tweens.add({
                targets: this,
                angle: { from: -5, to: 5 },
                duration: 200,
                yoyo: true,
                repeat: -1
            });
        } else {
            this.scene.tweens.killTweensOf(this);
            this.angle = 0;
        }
    }
}

export class TheFactory extends Phaser.Scene {
    private labs: Phaser.GameObjects.Group | null = null;
    private robots: TinyRobot[] = [];

    constructor() {
        super('TheFactory');
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    }

    create() {
        // Lab Floor - Dark grid
        const bg = this.add.image(400, 300, 'sky').setAlpha(0.3);
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        const grid = this.add.grid(400, 300, 1200, 800, 64, 64, 0x000000, 0, 0x00f2ff, 0.05);
        
        // Create Labs (Office Pods equivalent)
        this.labs = this.add.group();
        const labColors = [0x00f2ff, 0x7000ff, 0x00ff41, 0xffd700];
        
        for (let i = 0; i < 4; i++) {
            const lx = 150 + i * 170;
            const ly = 300;
            
            // Lab Base
            const lab = this.add.graphics();
            const color = labColors[i];
            
            lab.lineStyle(2, color, 0.3);
            lab.strokeRoundedRect(lx - 60, ly - 80, 120, 160, 10);
            
            // Glowing Terminal
            const terminal = this.add.graphics();
            terminal.fillStyle(color, 0.1);
            terminal.fillRoundedRect(lx - 40, ly - 60, 80, 50, 4);
            terminal.lineStyle(1, color, 0.5);
            terminal.strokeRoundedRect(lx - 40, ly - 60, 80, 50, 4);
            
            // Technical details
            for (let j = 0; j < 3; j++) {
                const line = this.add.graphics();
                line.fillStyle(color, 0.4);
                line.fillRect(lx - 30, ly - 50 + (j * 10), 40 + Math.random() * 20, 2);
            }

            this.add.text(lx, ly + 95, `LAB_${i+1}`, {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: Phaser.Display.Color.IntegerToColor(color).rgba
            }).setOrigin(0.5);
        }

        // Tiny Robots
        const robotColors = [0x00f2ff, 0x00ff41, 0xffd700, 0xff00ff];
        for (let i = 0; i < 10; i++) {
            const rx = Phaser.Math.Between(100, 700);
            const ry = Phaser.Math.Between(100, 500);
            const color = Phaser.Utils.Array.GetRandom(robotColors);
            const robot = new TinyRobot(this, rx, ry, color);
            this.robots.push(robot);

            this.moveRobot(robot);
        }

        // Title
        this.add.text(400, 30, 'NEURAL RESEARCH LABORATORIES', {
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#ffffff',
            stroke: '#00f2ff',
            strokeThickness: 1
        }).setOrigin(0.5).postFX.addGlow(0x00f2ff, 2, 0, false, 0.1, 10);
    }

    private moveRobot(robot: TinyRobot) {
        const tx = Phaser.Math.Between(100, 700);
        const ty = Phaser.Math.Between(100, 500);
        const duration = Phaser.Math.Between(3000, 6000);

        robot.setMoving(true);

        this.tweens.add({
            targets: robot,
            x: tx,
            y: ty,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                robot.setMoving(false);
                this.time.delayedCall(Phaser.Math.Between(1000, 3000), () => {
                    this.moveRobot(robot);
                });
            }
        });
    }

    update() {
        // Dynamic lab pulse
    }
}
