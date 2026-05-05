'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { TheFactory } from '@/lib/game/scenes/TheFactory';

export default function PhaserGame() {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && gameContainer.current && !gameInstance.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: gameContainer.current,
                scene: [TheFactory],
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0, x: 0 },
                        debug: false
                    }
                },
                transparent: true
            };

            gameInstance.current = new Phaser.Game(config);
        }

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-background/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
            <div ref={gameContainer} className="rounded-lg overflow-hidden border-2 border-[hsl(var(--neon-cyan)/0.3)] shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Live Neural Visualization System v1.0.4
            </p>
        </div>
    );
}
