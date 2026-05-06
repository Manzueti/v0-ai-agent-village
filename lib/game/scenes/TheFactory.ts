import Phaser from 'phaser';

const GALAXY_SHADER = `
precision mediump float;
uniform float time;
uniform vec2 resolution;

#define ITERATIONS 15
#define FORMUPARAM 0.53
#define VOLSTEPS 20
#define STEPSIZE 0.1
#define ZOOM 0.800
#define TILE 0.850
#define SPEED 0.005
#define BRIGHTNESS 0.0015
#define DARKMATTER 0.300
#define DISTFADING 0.730
#define SATURATION 0.850

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
    uv.y *= resolution.y / resolution.x;
    vec3 dir = vec3(uv * ZOOM, 1.0);
    float a1 = 0.5 + time * SPEED / 2.0;
    float a2 = 0.8 + time * SPEED;
    mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
    mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
    dir.xz *= rot1;
    dir.xy *= rot2;
    
    vec3 from = vec3(1.0, 0.5, 0.5);
    from += vec3(time * SPEED, time * SPEED, -2.0);
    from.xz *= rot1;
    from.xy *= rot2;
    
    float s = 0.1, fade = 1.0;
    vec3 v = vec3(0.0);
    for (int r = 0; r < VOLSTEPS; r++) {
        vec3 p = from + s * dir * 0.5;
        p = abs(vec3(TILE) - mod(p, vec3(TILE * 2.0)));
        float pa, a = pa = 0.0;
        for (int i = 0; i < ITERATIONS; i++) {
            p = abs(p) / dot(p, p) - FORMUPARAM;
            a += abs(length(p) - pa);
            pa = length(p);
        }
        float dm = max(0.0, DARKMATTER - a * a * 0.001);
        a *= a * a;
        if (r > 6) fade *= 1.0 - dm;
        v += fade;
        v += vec3(s, s * s, s * s * s * s) * a * BRIGHTNESS * fade;
        fade *= DISTFADING;
        s += STEPSIZE;
    }
    v = mix(vec3(length(v)), v, SATURATION);
    gl_FragColor = vec4(v * 0.01, 1.0);
}
`;

export class TheFactory extends Phaser.Scene {
    private robots: Phaser.GameObjects.Sprite[] = [];
    private trailTexture: Phaser.GameObjects.RenderTexture | null = null;
    private robotColors = [0x00f2ff, 0x7000ff, 0x00ff41, 0xffd700, 0xff00ff];

    constructor() {
        super('TheFactory');
    }

    preload() {
        this.load.image('robot-base', '/robot-vintage.png');
    }

    create() {
        // --- Galaxy Background Shader ---
        const baseShader = new Phaser.Display.BaseShader('GalaxyShader', GALAXY_SHADER);
        const shader = this.add.shader(baseShader, 400, 300, 800, 600);
        shader.setUniform('resolution.value', { x: 800, y: 600 });
        shader.setAlpha(0.6);

        // --- Texture Concept: Generate Tinted Robot Textures ---
        this.generateRobotTextures();

        this.trailTexture = this.add.renderTexture(0, 0, 800, 600).setOrigin(0).setAlpha(0.7);
        this.trailTexture.setBlendMode(Phaser.BlendModes.ADD);

        // Procedural Floor Texture (Circuit Pattern)
        const circuit = this.createCircuitFloor();

        // Environment
        this.createEnvironment();

        // Labs
        this.createLabs();

        // Spawn Optimized Robots with Stagger
        for (let i = 0; i < 18; i++) {
            const rx = Phaser.Math.Between(100, 700);
            const ry = Phaser.Math.Between(100, 500);
            const colorIdx = i % this.robotColors.length;
            
            const robot = this.add.sprite(rx, ry, `robot_tinted_${colorIdx}`);
            robot.setScale(0); // Start small for stagger entrance
            robot.setDisplaySize(48, 48); // Set a reasonable size for the robot image
            robot.setData('id', `UNIT_${i.toString().padStart(3, '0')}`);
            this.robots.push(robot);
        }

        // --- Tween Concept: Staggered Robot Entrance ---
        this.tweens.add({
            targets: this.robots,
            scale: 0.15, // Final scale relative to original image size
            duration: 800,
            ease: 'Back.easeOut',
            delay: this.tweens.stagger(100),
            onComplete: (tween, targets) => {
                targets.forEach((robot: any, index: number) => {
                    this.moveRobot(robot, index % this.robotColors.length);
                });
            }
        });

        // Title with Elastic entrance
        const title = this.add.text(400, -50, 'STELLAR REACH: GALAXY HUB', {
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#ffffff',
            stroke: '#00f2ff',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.tweens.chain({
            targets: title,
            tweens: [
                { y: 30, duration: 1500, ease: 'Elastic.easeOut' },
                { alpha: 0.6, duration: 1000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
            ]
        });
        
        title.postFX.addGlow(0x00f2ff, 2, 0, false, 0.1, 10);
    }

    private generateRobotTextures() {
        const sourceImage = this.textures.get('robot-base').getSourceImage() as HTMLImageElement;
        
        this.robotColors.forEach((color, idx) => {
            const tintedKey = `robot_tinted_${idx}`;
            if (!this.textures.exists(tintedKey)) {
                // Create a tinted version of the robot
                const canvas = this.textures.createCanvas(`${tintedKey}_canvas`, sourceImage.width, sourceImage.height);
                const ctx = canvas.getContext();
                
                // Draw base robot
                ctx.drawImage(sourceImage, 0, 0);
                
                // Apply color tint (overlay mode)
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
                ctx.globalAlpha = 0.3;
                ctx.fillRect(0, 0, sourceImage.width, sourceImage.height);
                
                canvas.refresh();
                this.textures.addImage(tintedKey, canvas.getSourceImage() as HTMLImageElement);
            }

            // Pre-generate HUD texture for this color
            const hudKey = `hud_${idx}`;
            if (!this.textures.exists(hudKey)) {
                const hudCanvas = this.textures.createCanvas(hudKey, 64, 16);
                const hCtx = hudCanvas?.context;
                if (hCtx) {
                    hCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    hCtx.fillRect(0, 0, 64, 16);
                    hCtx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
                    hCtx.fillRect(2, 12, 60, 2); // Status bar
                    hudCanvas.refresh();
                }
            }
        });
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
        const tile = this.add.tileSprite(400, 300, 800, 600, 'circuitBG').setAlpha(0.1);
        return tile;
    }

    private createLabs() {
        const labColors = [0x00f2ff, 0x7000ff, 0x00ff41, 0xffd700];
        for (let i = 0; i < 4; i++) {
            const lx = 150 + i * 170;
            const ly = 300;
            const color = labColors[i];
            const labContainer = this.add.container(lx, ly);

            const lab = this.add.graphics();
            lab.lineStyle(2, color, 0.2);
            lab.strokeRoundedRect(-60, -80, 120, 160, 12);
            
            const terminal = this.add.graphics();
            terminal.fillStyle(color, 0.05);
            terminal.fillRoundedRect(-40, -60, 80, 50, 4);
            terminal.lineStyle(1, color, 0.4);
            terminal.strokeRoundedRect(-40, -60, 80, 50, 4);

            const label = this.add.text(0, 95, `STATION_${i+1}`, {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: Phaser.Display.Color.IntegerToColor(color).rgba,
                letterSpacing: 2
            }).setOrigin(0.5);

            labContainer.add([lab, terminal, label]);

            this.tweens.add({
                targets: labContainer,
                scale: 1.02,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: i * 500
            });
        }
    }

    private createEnvironment() {
        const colors = [0x00f2ff, 0x7000ff, 0x00ff41];
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

        this.tweens.add({
            targets: robot,
            x: tx,
            y: ty,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: robot,
                    scale: robot.scale * 1.2,
                    duration: 300,
                    ease: 'Bounce.easeOut',
                    yoyo: true,
                    onComplete: () => {
                        this.time.delayedCall(Phaser.Math.Between(2000, 5000), () => {
                            this.moveRobot(robot, colorIdx);
                        });
                    }
                });
            }
        });
    }

    update() {
        if (this.trailTexture) {
            this.trailTexture.fill(0x000000, 0.12);
            this.trailTexture.beginDraw();
            this.robots.forEach((robot, i) => {
                this.trailTexture?.batchDraw(robot, robot.x, robot.y);
                const colorIdx = i % this.robotColors.length;
                this.trailTexture?.batchDrawFrame(`hud_${colorIdx}`, '__BASE', robot.x - 32, robot.y - 40);
            });
            this.trailTexture.endDraw();
        }
    }
}


