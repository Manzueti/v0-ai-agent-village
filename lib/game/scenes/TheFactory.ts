import Phaser from 'phaser';

export class TheFactory extends Phaser.Scene {
    private robots: Phaser.GameObjects.Sprite[] = [];
    private trailTexture: Phaser.GameObjects.RenderTexture | null = null;
    private hudTexture: Phaser.GameObjects.DynamicTexture | null = null;
    private robotColors = [0x00f2ff, 0x7000ff, 0x00ff41, 0xffd700, 0xff00ff];

    constructor() {
        super('TheFactory');
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    }

    create() {
        // --- Texture Concept: Generate Procedural Robot Spritesheet ---
        this.generateRobotTextures();

        // --- Texture Concept: Dynamic Texture for shared HUD elements ---
        this.hudTexture = this.textures.addDynamicTexture('robotHUD', 64, 16);
        this.hudTexture?.setIsSpriteTexture(false);

        // --- Texture Concept: RenderTexture for High-Fidelity Motion Trails ---
        this.trailTexture = this.add.renderTexture(0, 0, 800, 600).setOrigin(0).setAlpha(0.7);
        this.trailTexture.setBlendMode(Phaser.BlendModes.ADD);

        // Background
        const bg = this.add.image(400, 300, 'sky').setAlpha(0.2);
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        // Procedural Floor Texture (Circuit Pattern)
        this.createCircuitFloor();

        // Environment
        this.createEnvironment();

        // Labs
        this.createLabs();

        // Spawn Optimized Robots
        for (let i = 0; i < 18; i++) {
            const rx = Phaser.Math.Between(100, 700);
            const ry = Phaser.Math.Between(100, 500);
            const colorIdx = i % this.robotColors.length;
            
            const robot = this.add.sprite(rx, ry, `robot_${colorIdx}`, 0);
            robot.setScale(1.2);
            robot.setData('id', `UNIT_${i.toString().padStart(3, '0')}`);
            this.robots.push(robot);

            // Create animations
            if (!this.anims.exists(`walk_${colorIdx}`)) {
                this.anims.create({
                    key: `walk_${colorIdx}`,
                    frames: [
                        { key: `robot_${colorIdx}`, frame: 1 },
                        { key: `robot_${colorIdx}`, frame: 0 },
                        { key: `robot_${colorIdx}`, frame: 2 },
                        { key: `robot_${colorIdx}`, frame: 0 }
                    ],
                    frameRate: 8,
                    repeat: -1
                });
            }

            this.moveRobot(robot, colorIdx);
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

    private generateRobotTextures() {
        this.robotColors.forEach((color, idx) => {
            const key = `robot_${idx}`;
            if (this.textures.exists(key)) return;

            const canvasTexture = this.textures.createCanvas(key, 96, 32);
            const ctx = canvasTexture?.context;
            if (!ctx) return;

            this.drawRobotFrame(ctx, 32, 0, color, 'idle');
            this.drawRobotFrame(ctx, 0, 0, color, 'left');
            this.drawRobotFrame(ctx, 64, 0, color, 'right');

            canvasTexture.add(0, 0, 32, 0, 32, 32);
            canvasTexture.add(1, 0, 0, 0, 32, 32);
            canvasTexture.add(2, 0, 64, 0, 32, 32);
            
            canvasTexture.refresh();
        });
    }

    private drawRobotFrame(ctx: CanvasRenderingContext2D, x: number, y: number, color: number, state: string) {
        const hexColor = `#${color.toString(16).padStart(6, '0')}`;
        ctx.save();
        ctx.translate(x + 16, y + 16);
        
        if (state === 'left') ctx.rotate(-0.1);
        if (state === 'right') ctx.rotate(0.1);

        ctx.fillStyle = '#111111';
        ctx.strokeStyle = hexColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-8, -10, 16, 20, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = hexColor;
        ctx.beginPath();
        ctx.arc(0, -4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    private createCircuitFloor() {
        const canvasTexture = this.textures.createCanvas('circuitBG', 128, 128);
        const ctx = canvasTexture?.context;
        if (ctx) {
            ctx.strokeStyle = '#00f2ff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const x = Math.random() * 128;
                const y = Math.random() * 128;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, y);
                ctx.lineTo(128, y);
            }
            ctx.stroke();
            canvasTexture.refresh();
        }
        this.add.tileSprite(400, 300, 800, 600, 'circuitBG').setAlpha(0.1);
        this.add.grid(400, 300, 1200, 800, 64, 64, 0x000000, 0, 0x00f2ff, 0.05);
    }

    private createLabs() {
        const labColors = [0x00f2ff, 0x7000ff, 0x00ff41, 0xffd700];
        for (let i = 0; i < 4; i++) {
            const lx = 150 + i * 170;
            const ly = 300;
            const color = labColors[i];
            const lab = this.add.graphics();
            lab.lineStyle(2, color, 0.2);
            lab.strokeRoundedRect(lx - 60, ly - 80, 120, 160, 12);
            
            const terminal = this.add.graphics();
            terminal.fillStyle(color, 0.05);
            terminal.fillRoundedRect(lx - 40, ly - 60, 80, 50, 4);
            terminal.lineStyle(1, color, 0.4);
            terminal.strokeRoundedRect(lx - 40, ly - 60, 80, 50, 4);

            this.add.text(lx, ly + 95, `STATION_${i+1}`, {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: Phaser.Display.Color.IntegerToColor(color).rgba,
                letterSpacing: 2
            }).setOrigin(0.5);
        }
    }

    private createEnvironment() {
        const colors = [0x00f2ff, 0x7000ff, 0x00ff41];
        for (let i = 0; i < 8; i++) {
            const tx = Phaser.Math.Between(50, 750);
            const ty = Phaser.Math.Between(50, 550);
            if (ty > 200 && ty < 400) continue;
            const tree = this.add.graphics();
            const color = Phaser.Utils.Array.GetRandom(colors);
            tree.lineStyle(1, 0x333333, 1);
            tree.lineBetween(tx, ty, tx, ty - 30);
            tree.fillStyle(color, 0.1);
            tree.fillCircle(tx, ty - 30, 12);
            tree.lineStyle(1, color, 0.5);
            tree.strokeCircle(tx, ty - 30, 12);
        }

        for (let i = 0; i < 20; i++) {
            const node = this.add.graphics();
            node.fillStyle(Phaser.Utils.Array.GetRandom(colors), 0.3);
            node.fillCircle(0, 0, 1.5);
            node.x = Phaser.Math.Between(0, 800);
            node.y = Phaser.Math.Between(0, 600);
            this.tweens.add({
                targets: node,
                y: node.y - 30,
                alpha: 0,
                duration: 3000 + Math.random() * 4000,
                repeat: -1
            });
        }
    }

    private moveRobot(robot: Phaser.GameObjects.Sprite, colorIdx: number) {
        const tx = Phaser.Math.Between(100, 700);
        const ty = Phaser.Math.Between(100, 500);
        const duration = Phaser.Math.Between(5000, 10000);

        robot.play(`walk_${colorIdx}`);

        this.tweens.add({
            targets: robot,
            x: tx,
            y: ty,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                robot.stop();
                robot.setFrame(0);
                this.time.delayedCall(Phaser.Math.Between(2000, 5000), () => {
                    this.moveRobot(robot, colorIdx);
                });
            }
        });
    }

    update() {
        if (this.trailTexture && this.hudTexture) {
            // Motion Blur persistence
            this.trailTexture.fill(0x000000, 0.12);
            
            this.robots.forEach(robot => {
                // Draw robot to trail
                this.trailTexture?.draw(robot, robot.x, robot.y);
                
                // --- Texture Concept: Batch Draw shared HUD to trail ---
                // We create a temporary look for the HUD on our Dynamic Texture
                this.hudTexture?.clear();
                this.hudTexture?.fill(0x000000, 0.5, 0, 0, 64, 16);
                
                // We don't actually need a real Text object here for performance, 
                // we can just draw a small health bar/id onto the HUD texture
                const idColor = this.robotColors[this.robots.indexOf(robot) % this.robotColors.length];
                this.hudTexture?.fill(idColor, 1, 2, 12, 60, 2); // Status bar
                
                // Draw HUD above robot in the trail texture
                this.trailTexture?.draw(this.hudTexture, robot.x - 32, robot.y - 25);
            });
        }
    }
}
}
