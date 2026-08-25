"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetGameRef = useRef<(() => void) | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1;
    let dy = 0;
    const gridSize = 20;
    const tileCount = 20; // 400x400

    let interval: NodeJS.Timeout;

    const resetGame = () => {
      snake = [{ x: 10, y: 10 }];
      dx = 1; dy = 0;
      setScore(0);
      setGameOver(false);
      spawnFood();
      clearInterval(interval);
      interval = setInterval(gameLoop, 100);
    };
    resetGameRef.current = resetGame;

    const spawnFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    };

    const gameLoop = () => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          setGameOver(true);
          clearInterval(interval);
          return;
        }
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    };

    const draw = () => {
      // Clear
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Snake
      ctx.fillStyle = '#6366f1';
      for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
      }

      // Draw Food
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    interval = setInterval(gameLoop, 100);
    spawnFood();

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ece9d8', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
        <span>Snake (Classic)</span>
        <span>Score: {score}</span>
      </div>
      <div style={{ border: '2px solid #7f9db9' }}>
        <canvas ref={canvasRef} width={400} height={400} style={{ display: 'block' }}></canvas>
      </div>
      {gameOver && (
        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
            Game Over!
          </div>
          <button 
            onClick={() => resetGameRef.current?.()}
            style={{ padding: '5px 15px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
