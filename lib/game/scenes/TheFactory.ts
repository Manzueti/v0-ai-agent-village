import Phaser from 'phaser';

export class TheFactory extends Phaser.Scene {
    private agents: Phaser.GameObjects.Group | null = null;

    constructor() {
        super('TheFactory');
    }

    preload() {
        // Load a standard Phaser spritesheet for demonstration
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    }

    create() {
        // Add background
        const sky = this.add.image(400, 300, 'sky');
        sky.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        // Neural Flux Particles
        const particles = this.add.particles(0, 0, 'dude', {
            frame: 4,
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.5, end: 0 },
            speed: 100,
            lifespan: 1000,
            blendMode: 'ADD',
            frequency: 100,
            gravityY: -50
        });

        // Create animations based on Phaser concepts
        // https://docs.phaser.io/phaser/concepts/animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.agents = this.add.group();

        // Spawn some agents
        for (let i = 0; i < 12; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            const agent = this.add.sprite(x, y, 'dude');
            agent.setInteractive();
            this.agents.add(agent);
            
            // Interaction: Pulse on click
            agent.on('pointerdown', () => {
                this.tweens.add({
                    targets: agent,
                    scale: 1.5,
                    duration: 200,
                    yoyo: true,
                    ease: 'Bounce.easeOut'
                });
                particles.emitParticleAt(agent.x, agent.y, 20);
            });

            // Randomly start an animation
            const anim = Phaser.Utils.Array.GetRandom(['left', 'right', 'turn']);
            agent.play(anim);
            
            // Add some movement logic
            this.tweens.add({
                targets: agent,
                x: x + Phaser.Math.Between(-150, 150),
                y: y + Phaser.Math.Between(-150, 150),
                duration: 3000 + Math.random() * 4000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                onYoyo: () => {
                    // Change animation when turning back
                    if (agent.anims.currentAnim?.key === 'left') agent.play('right');
                    else if (agent.anims.currentAnim?.key === 'right') agent.play('left');
                    else agent.play(Phaser.Utils.Array.GetRandom(['left', 'right']));
                }
            });
        }

        // Add a title with glow effect
        const title = this.add.text(400, 30, 'NEURAL FACTORY VISUALIZER', {
            fontSize: '42px',
            color: '#00f2ff',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        // Scene update logic
    }
}
