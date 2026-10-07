
"use client";

import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { techLogos } from '@/lib/data';
import { Sparkles } from 'lucide-react';

// Game settings
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const ITEM_SIZE = 24; // Adjusted for logos
const GAME_WIDTH = 192; // Based on w-48
const GAME_HEIGHT = 384; // Based on h-96
const ITEM_SPEED = 2;
const ITEM_SPAWN_RATE = 1200; // ms

type TechLogo = typeof techLogos[number];

type FallingItem = {
    id: number;
    x: number;
    y: number;
    logo: TechLogo;
};

type GameState = {
    items: FallingItem[];
    score: number;
    gameOver: boolean;
};

type GameAction = 
    | { type: 'TICK'; playerX: number }
    | { type: 'SPAWN_ITEM' }
    | { type: 'RESET' };

const initialState: GameState = {
    items: [],
    score: 0,
    gameOver: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'TICK': {
            if (state.gameOver) return state;

            let newScore = state.score;
            let isGameOver = false;

            const updatedItems = state.items
                .map(item => ({ ...item, y: item.y + ITEM_SPEED }))
                .filter(item => {
                    const playerRect = { x: action.playerX, y: GAME_HEIGHT - PLAYER_HEIGHT, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
                    const itemRect = { x: item.x, y: item.y, width: ITEM_SIZE, height: ITEM_SIZE };

                    const didCollide = 
                        playerRect.x < itemRect.x + itemRect.width &&
                        playerRect.x + playerRect.width > itemRect.x &&
                        playerRect.y < itemRect.y + itemRect.height &&
                        playerRect.y + playerRect.height > itemRect.y;

                    if (didCollide) {
                        newScore++;
                        return false; // Remove item on collision
                    }
                    
                    if (item.y >= GAME_HEIGHT) {
                        isGameOver = true;
                    }

                    return item.y < GAME_HEIGHT;
                });
            
            return {
                ...state,
                items: updatedItems,
                score: newScore,
                gameOver: isGameOver,
            };
        }
        case 'SPAWN_ITEM': {
             if (state.gameOver) return state;
             const newItem: FallingItem = {
                id: Date.now(),
                x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
                y: -ITEM_SIZE,
                logo: techLogos[Math.floor(Math.random() * techLogos.length)],
            };
            return {
                ...state,
                items: [...state.items, newItem],
            }
        }
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}


export function MiniGame() {
    const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    const [gameState, dispatch] = useReducer(gameReducer, initialState);
    
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number>();
    
    const playerXRef = useRef(playerX);
    playerXRef.current = playerX;

    const resetGame = useCallback(() => {
        dispatch({ type: 'RESET' });
        setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    }, []);

    useEffect(() => {
        let lastSpawnTime = 0;

        const gameLoop = (timestamp: number) => {
            if (!gameState.gameOver) {
                 dispatch({ type: 'TICK', playerX: playerXRef.current });

                if (timestamp - lastSpawnTime > ITEM_SPAWN_RATE) {
                    lastSpawnTime = timestamp;
                    dispatch({ type: 'SPAWN_ITEM' });
                }
                animationFrameId.current = requestAnimationFrame(gameLoop);
            }
        };

        if (!gameState.gameOver) {
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
        
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameState.gameOver]);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (gameState.gameOver || !gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left - (PLAYER_WIDTH / 2);
        setPlayerX(Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_WIDTH)));
    };
    
    return (
        <div 
            ref={gameAreaRef}
            className="w-full h-full bg-gray-900 relative overflow-hidden select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
        >
            {gameState.gameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 p-4 text-center">
                    <Sparkles className="h-10 w-10 text-yellow-400 mb-4" />
                    <h3 className="text-white text-xl font-bold">Nice Catch!</h3>
                    <p className="text-white/80 text-sm mt-2">This interactive game was built to showcase our frontend development skills.</p>
                    <p className="text-yellow-300 font-bold text-lg mt-4">Final Score: {gameState.score}</p>
                    <Button onClick={resetGame} variant="ghost" className="mt-4 text-white hover:bg-white/20">Play Again</Button>
                </div>
            ) : (
                 <div className="absolute top-2 right-2 text-white font-bold text-lg z-20" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
                    Score: {gameState.score}
                </div>
            )}

            {/* Falling Items */}
            {gameState.items.map(item => (
                 <div
                    key={item.id}
                    className="absolute z-10 flex items-center justify-center"
                    style={{ 
                        width: ITEM_SIZE, 
                        height: ITEM_SIZE,
                        left: item.x,
                        top: item.y 
                    }} 
                 >
                    <Image
                        src={item.logo.logo}
                        alt={item.logo.name}
                        width={ITEM_SIZE}
                        height={ITEM_SIZE}
                        className={cn("object-contain", item.logo.invert && "invert")}
                    />
                 </div>
            ))}

            {/* Player */}
            <div 
                className="absolute bottom-0 z-10"
                style={{
                    width: PLAYER_WIDTH,
                    height: PLAYER_HEIGHT,
                    left: playerX,
                }}
            >
                <Image
                    src="https://digitiful.net/wp-content/uploads/elementor/thumbs/DG-05-1-r9tunke78cyiykbizacfpfcdwqz7outsg8xjrtvb4a.png"
                    alt="Player"
                    width={PLAYER_WIDTH}
                    height={PLAYER_HEIGHT}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
