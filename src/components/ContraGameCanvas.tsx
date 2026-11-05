import React, { useRef, useEffect, useCallback } from 'react';
import {
  Player,
  Bullet,
  Enemy,
  PowerUpPod,
  Particle,
  FloatingText,
  StageData,
  WeaponType,
} from '../types/game';
import { soundManager } from '../audio/soundManager';

interface ContraGameCanvasProps {
  stage: StageData;
  score: number;
  lives: number;
  weapon: WeaponType;
  rapidFire: boolean;
  hasShield: boolean;
  activeCheckpointIndex: number;
  isPaused: boolean;
  isQuizActive: boolean;
  onScoreAdd: (pts: number) => void;
  onLivesChange: (lives: number) => void;
  onWeaponChange: (weapon: WeaponType) => void;
  onRapidFireChange: (rapid: boolean) => void;
  onShieldChange: (shield: boolean) => void;
  onReachCheckpoint: (checkpointIdx: number) => void;
  onStageClear: () => void;
  onGameOver: () => void;
  // External control flags from keyboard / virtual gamepad
  inputState: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    shoot: boolean;
    jump: boolean;
  };
}

export const ContraGameCanvas: React.FC<ContraGameCanvasProps> = ({
  stage,
  score,
  lives,
  weapon,
  rapidFire,
  hasShield,
  activeCheckpointIndex,
  isPaused,
  isQuizActive,
  onScoreAdd,
  onLivesChange,
  onWeaponChange,
  onRapidFireChange,
  onShieldChange,
  onReachCheckpoint,
  onStageClear,
  onGameOver,
  inputState,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core Game State Refs to avoid stale closures inside 60fps requestAnimationFrame
  const gameStateRef = useRef({
    cameraX: 0,
    player: {
      x: 80,
      y: 330,
      vx: 0,
      vy: 0,
      width: 28,
      height: 48,
      isGrounded: true,
      isCrouching: false,
      facing: 'right' as 'left' | 'right',
      aimDirection: 'straight' as 'straight' | 'up' | 'up-diag' | 'down-diag' | 'down',
      lives: lives,
      score: score,
      weapon: weapon,
      rapidFire: rapidFire,
      shieldTimer: hasShield ? 600 : 0,
      invincibleTimer: 60,
      isJumping: false,
      jumpFrame: 0,
      animFrame: 0,
      isDead: false,
    } as Player,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    pods: [] as PowerUpPod[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    bulletIdCounter: 1,
    shootCooldown: 0,
    screenShake: 0,
    bossSpawned: false,
    bossDefeated: false,
    lastPodSpawnX: 200,
    lastEnemySpawnX: 200,
    timeInStage: 0,
  });

  // Sync props to refs
  useEffect(() => {
    gameStateRef.current.player.weapon = weapon;
    gameStateRef.current.player.rapidFire = rapidFire;
  }, [weapon, rapidFire]);

  // Reset or initialize level entities on stage change
  useEffect(() => {
    const s = gameStateRef.current;
    s.cameraX = 0;
    s.player.x = 80;
    s.player.y = 330;
    s.player.vx = 0;
    s.player.vy = 0;
    s.player.isGrounded = true;
    s.player.invincibleTimer = 90;
    s.bullets = [];
    s.enemies = [];
    s.pods = [];
    s.particles = [];
    s.floatingTexts = [];
    s.bossSpawned = false;
    s.bossDefeated = false;
    s.lastPodSpawnX = 200;
    s.lastEnemySpawnX = 200;
    s.timeInStage = 0;
  }, [stage.id]);

  // Add floating combat text
  const addFloatingText = (x: number, y: number, text: string, color = '#facc15') => {
    gameStateRef.current.floatingTexts.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      life: 45,
    });
  };

  // Create explosion particles
  const createExplosion = (x: number, y: number, color = '#f97316', count = 16) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      gameStateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: Math.random() * 25 + 15,
        size: Math.random() * 4 + 2,
        color: i % 2 === 0 ? color : '#fef08a',
      });
    }
  };

  // Fire Player Weapon
  const firePlayerBullet = useCallback(() => {
    const s = gameStateRef.current;
    const p = s.player;
    if (p.isDead || s.shootCooldown > 0) return;

    const baseSpeed = 12;
    let dirX = p.facing === 'right' ? 1 : -1;
    let dirY = 0;

    if (p.aimDirection === 'up') {
      dirX = 0;
      dirY = -1;
    } else if (p.aimDirection === 'up-diag') {
      dirX = p.facing === 'right' ? 0.707 : -0.707;
      dirY = -0.707;
    } else if (p.aimDirection === 'down-diag' && !p.isGrounded) {
      dirX = p.facing === 'right' ? 0.707 : -0.707;
      dirY = 0.707;
    }

    const startX = p.x + (p.facing === 'right' ? p.width + 6 : -6);
    const startY = p.isCrouching ? p.y + p.height - 12 : p.y + 16;

    // Bullet behavior based on weapon type
    if (p.weapon === 'NORMAL') {
      s.bullets.push({
        id: s.bulletIdCounter++,
        x: startX,
        y: startY,
        vx: dirX * baseSpeed,
        vy: dirY * baseSpeed,
        radius: 3.5,
        color: '#facc15',
        isPlayer: true,
        damage: 1,
      });
      soundManager.playShoot('NORMAL');
      s.shootCooldown = p.rapidFire ? 7 : 14;
    } else if (p.weapon === 'MACHINE') {
      s.bullets.push({
        id: s.bulletIdCounter++,
        x: startX,
        y: startY + (Math.random() * 4 - 2),
        vx: dirX * (baseSpeed + 2),
        vy: dirY * (baseSpeed + 2),
        radius: 4,
        color: '#fb923c',
        isPlayer: true,
        damage: 1.4,
      });
      soundManager.playShoot('MACHINE');
      s.shootCooldown = p.rapidFire ? 5 : 8;
    } else if (p.weapon === 'SPREAD') {
      // Iconic Contra 5-Way Red Spread Gun!
      const baseAngle = Math.atan2(dirY, dirX);
      const spreadAngles = [-0.28, -0.14, 0, 0.14, 0.28];
      spreadAngles.forEach((offset) => {
        const angle = baseAngle + offset;
        s.bullets.push({
          id: s.bulletIdCounter++,
          x: startX,
          y: startY,
          vx: Math.cos(angle) * (baseSpeed + 1),
          vy: Math.sin(angle) * (baseSpeed + 1),
          radius: 5,
          color: '#ef4444',
          isPlayer: true,
          damage: 1.8,
        });
      });
      soundManager.playShoot('SPREAD');
      s.shootCooldown = p.rapidFire ? 12 : 20;
    } else if (p.weapon === 'LASER') {
      // Penetrating high-velocity laser beam
      s.bullets.push({
        id: s.bulletIdCounter++,
        x: startX,
        y: startY,
        vx: dirX * (baseSpeed + 6),
        vy: dirY * (baseSpeed + 6),
        radius: 6,
        color: '#38bdf8',
        isPlayer: true,
        damage: 3.5,
        piercing: true,
      });
      soundManager.playShoot('LASER');
      s.shootCooldown = p.rapidFire ? 10 : 16;
    }
  }, []);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const VIRTUAL_WIDTH = 800;
    const VIRTUAL_HEIGHT = 450;
    const GROUND_Y = 380;

    const gameLoop = () => {
      // Skip updates if paused or modal quiz active
      if (!isPaused && !isQuizActive) {
        const s = gameStateRef.current;
        const p = s.player;
        s.timeInStage++;

        // 1. Handle Player Input & Physics
        if (!p.isDead) {
          // Horizontal movement
          if (inputState.left) {
            p.vx = -4.2;
            p.facing = 'left';
            if (!p.isJumping) p.animFrame += 0.25;
          } else if (inputState.right) {
            p.vx = 4.2;
            p.facing = 'right';
            if (!p.isJumping) p.animFrame += 0.25;
          } else {
            p.vx = 0;
          }

          // Crouching
          p.isCrouching = inputState.down && p.isGrounded;
          if (p.isCrouching) {
            p.vx = 0;
          }

          // Aiming direction
          if (inputState.up) {
            if (inputState.left || inputState.right) {
              p.aimDirection = 'up-diag';
            } else {
              p.aimDirection = 'up';
            }
          } else if (inputState.down && !p.isGrounded) {
            p.aimDirection = 'down-diag';
          } else {
            p.aimDirection = 'straight';
          }

          // Jump
          if (inputState.jump && p.isGrounded && !p.isCrouching) {
            p.vy = -12.5;
            p.isGrounded = false;
            p.isJumping = true;
            p.jumpFrame = 0;
            soundManager.playJump();
          }

          // Shoot
          if (s.shootCooldown > 0) s.shootCooldown--;
          if (inputState.shoot) {
            firePlayerBullet();
          }

          // Apply Gravity & Velocity
          p.vy += 0.65; // gravity
          p.x += p.vx;
          p.y += p.vy;

          // Ground collision
          if (p.y + p.height >= GROUND_Y) {
            p.y = GROUND_Y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            p.isJumping = false;
          }

          if (p.isJumping) {
            p.jumpFrame += 0.35;
          }

          // Invincibility & Shield Timers
          if (p.invincibleTimer > 0) p.invincibleTimer--;
          if (p.shieldTimer > 0) {
            p.shieldTimer--;
            if (p.shieldTimer === 0) onShieldChange(false);
          }

          // Clamp player within stage bounds & screen edges
          const minX = s.cameraX;
          const maxX = s.cameraX + VIRTUAL_WIDTH - p.width;
          if (p.x < minX) p.x = minX;
          if (p.x > maxX) p.x = maxX;

          // Camera scrolling (smooth lead following player)
          const targetCamX = p.x - VIRTUAL_WIDTH * 0.35;
          s.cameraX += (targetCamX - s.cameraX) * 0.12;
          s.cameraX = Math.max(0, Math.min(s.cameraX, stage.length - VIRTUAL_WIDTH));

          // 2. Checkpoint Gates Collision
          // Each stage has 5 checkpoints. Gate is at stage.checkpoints[checkpointIdx]
          if (activeCheckpointIndex < stage.checkpoints.length) {
            const gateX = stage.checkpoints[activeCheckpointIndex];
            // If player approaches gate, stop player and trigger question modal
            if (p.x + p.width >= gateX - 25 && p.x <= gateX + 50) {
              p.x = gateX - 25 - p.width;
              p.vx = 0;
              soundManager.playCheckpointAlert();
              onReachCheckpoint(activeCheckpointIndex);
            }
          }

          // 3. Spawning Enemies along the path
          if (s.cameraX + VIRTUAL_WIDTH > s.lastEnemySpawnX && s.lastEnemySpawnX < stage.length - 800) {
            s.lastEnemySpawnX += Math.random() * 220 + 160;
            const enemyTypes: import('../types/game').EnemyType[] = 
              stage.id === 1 ? ['RUNNER', 'RUNNER', 'SNIPER'] :
              stage.id === 2 ? ['RUNNER', 'SNIPER', 'DRONE', 'FLAME_THROWER'] :
              ['RUNNER', 'DRONE', 'FLAME_THROWER', 'TURRET'];

            const selectedType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const spawnX = s.cameraX + VIRTUAL_WIDTH + 40;
            const spawnY = selectedType === 'DRONE' ? 180 + Math.random() * 80 : GROUND_Y - 48;

            s.enemies.push({
              id: Math.random(),
              type: selectedType,
              x: spawnX,
              y: spawnY,
              vx: selectedType === 'DRONE' ? -2.2 : -2.6,
              vy: 0,
              width: 32,
              height: 48,
              hp: selectedType === 'FLAME_THROWER' ? 4 : selectedType === 'DRONE' ? 3 : 2,
              maxHp: selectedType === 'FLAME_THROWER' ? 4 : selectedType === 'DRONE' ? 3 : 2,
              scoreValue: selectedType === 'FLAME_THROWER' ? 300 : 150,
              shootCooldown: Math.random() * 60 + 60,
              shootTimer: 0,
              facing: 'left',
              animFrame: 0,
            });
          }

          // 4. Spawning Flying Powerup Pod ("Flying Falcon")
          if (s.cameraX + VIRTUAL_WIDTH > s.lastPodSpawnX && s.lastPodSpawnX < stage.length - 1000) {
            s.lastPodSpawnX += Math.random() * 550 + 400;
            const items: ('S' | 'M' | 'L' | 'B' | 'R')[] = ['S', 'M', 'L', 'B', 'R'];
            const randomItem = items[Math.floor(Math.random() * items.length)];

            s.pods.push({
              id: Math.random(),
              x: s.cameraX + VIRTUAL_WIDTH + 60,
              y: 120 + Math.random() * 60,
              vx: -3.5,
              vy: 0,
              itemType: randomItem,
              hp: 1,
              isDropped: false,
            });
          }

          // 5. Boss Spawn at end of stage
          const bossTriggerX = stage.length - 750;
          if (p.x >= bossTriggerX && !s.bossSpawned) {
            s.bossSpawned = true;
            soundManager.playBossAlert();
            const bossType = stage.id === 1 ? 'BOSS_CORE_1' : stage.id === 2 ? 'BOSS_MECH_2' : 'BOSS_ALIEN_3';
            s.enemies.push({
              id: 9999,
              type: bossType,
              x: stage.length - 280,
              y: GROUND_Y - 140,
              vx: 0,
              vy: 0,
              width: 140,
              height: 140,
              hp: stage.bossHp,
              maxHp: stage.bossHp,
              scoreValue: 5000,
              shootCooldown: 50,
              shootTimer: 0,
              facing: 'left',
              animFrame: 0,
              isBoss: true,
            });
          }
        }

        // 6. Update Bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i];
          b.x += b.vx;
          b.y += b.vy;

          // Remove offscreen bullets
          if (
            b.x < s.cameraX - 50 ||
            b.x > s.cameraX + VIRTUAL_WIDTH + 50 ||
            b.y < -50 ||
            b.y > VIRTUAL_HEIGHT + 50
          ) {
            s.bullets.splice(i, 1);
            continue;
          }

          // Player bullets hitting enemies
          if (b.isPlayer) {
            let bulletConsumed = false;
            for (let j = s.enemies.length - 1; j >= 0; j--) {
              const enemy = s.enemies[j];
              if (
                b.x >= enemy.x &&
                b.x <= enemy.x + enemy.width &&
                b.y >= enemy.y &&
                b.y <= enemy.y + enemy.height
              ) {
                enemy.hp -= b.damage;
                soundManager.playEnemyHit();
                createExplosion(b.x, b.y, '#facc15', 5);

                if (!b.piercing) {
                  bulletConsumed = true;
                }

                if (enemy.hp <= 0) {
                  createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#f97316', 24);
                  soundManager.playExplosion(enemy.isBoss ? 'large' : 'small');
                  s.screenShake = enemy.isBoss ? 20 : 6;
                  onScoreAdd(enemy.scoreValue);
                  addFloatingText(enemy.x, enemy.y - 10, `+${enemy.scoreValue}`);

                  if (enemy.isBoss) {
                    s.bossDefeated = true;
                    soundManager.playStageClear();
                    setTimeout(() => {
                      onStageClear();
                    }, 2000);
                  }

                  s.enemies.splice(j, 1);
                }
                break;
              }
            }

            // Player bullets hitting Flying Powerup Pods
            if (!bulletConsumed) {
              for (let k = s.pods.length - 1; k >= 0; k--) {
                const pod = s.pods[k];
                if (!pod.isDropped) {
                  if (
                    b.x >= pod.x - 18 &&
                    b.x <= pod.x + 18 &&
                    b.y >= pod.y - 18 &&
                    b.y <= pod.y + 18
                  ) {
                    pod.isDropped = true;
                    pod.vx = -0.5;
                    pod.vy = -3;
                    createExplosion(pod.x, pod.y, '#38bdf8', 12);
                    soundManager.playExplosion('small');
                    bulletConsumed = true;
                    break;
                  }
                }
              }
            }

            if (bulletConsumed) {
              s.bullets.splice(i, 1);
            }
          }
          // Enemy bullets hitting Player
          else {
            if (
              !p.isDead &&
              p.invincibleTimer === 0 &&
              b.x >= p.x &&
              b.x <= p.x + p.width &&
              b.y >= p.y &&
              b.y <= p.y + p.height
            ) {
              s.bullets.splice(i, 1);

              if (p.shieldTimer > 0) {
                // Shield absorbs damage!
                createExplosion(b.x, b.y, '#06b6d4', 10);
                soundManager.playExplosion('small');
                addFloatingText(p.x, p.y - 15, 'CHẮN THÀNH CÔNG!', '#38bdf8');
              } else {
                // Player takes damage / loses a life
                p.lives--;
                onLivesChange(p.lives);
                createExplosion(p.x + p.width / 2, p.y + p.height / 2, '#ef4444', 28);
                soundManager.playExplosion('large');
                s.screenShake = 14;

                if (p.lives <= 0) {
                  p.isDead = true;
                  soundManager.playGameOver();
                  setTimeout(() => {
                    onGameOver();
                  }, 1800);
                } else {
                  // Respawn with invincibility
                  p.invincibleTimer = 120;
                  p.x = Math.max(s.cameraX + 40, p.x - 60);
                  p.y = GROUND_Y - p.height;
                  p.vy = 0;
                  addFloatingText(p.x, p.y - 20, 'CHIẾN BINH HỒI SINH!', '#ef4444');
                }
              }
            }
          }
        }

        // 7. Update Flying Pods & Powerup Drop Collection
        for (let i = s.pods.length - 1; i >= 0; i--) {
          const pod = s.pods[i];
          if (!pod.isDropped) {
            pod.x += pod.vx;
            pod.y += Math.sin(s.timeInStage * 0.08) * 1.5; // Sine wave flight path
          } else {
            // Capsule falling down with gravity
            pod.x += pod.vx;
            pod.vy += 0.25;
            pod.y += pod.vy;

            if (pod.y >= GROUND_Y - 20) {
              pod.y = GROUND_Y - 20;
              pod.vy = 0;
            }

            // Player pickup
            if (
              !p.isDead &&
              p.x + p.width >= pod.x - 16 &&
              p.x <= pod.x + 16 &&
              p.y + p.height >= pod.y - 16 &&
              p.y <= pod.y + 16
            ) {
              soundManager.playPowerup();
              createExplosion(pod.x, pod.y, '#a855f7', 15);

              if (pod.itemType === 'S') {
                p.weapon = 'SPREAD';
                onWeaponChange('SPREAD');
                addFloatingText(p.x, p.y - 25, 'SPREAD GUN [S]!', '#ef4444');
              } else if (pod.itemType === 'M') {
                p.weapon = 'MACHINE';
                onWeaponChange('MACHINE');
                addFloatingText(p.x, p.y - 25, 'MACHINE GUN [M]!', '#f59e0b');
              } else if (pod.itemType === 'L') {
                p.weapon = 'LASER';
                onWeaponChange('LASER');
                addFloatingText(p.x, p.y - 25, 'LASER BEAM [L]!', '#38bdf8');
              } else if (pod.itemType === 'B') {
                p.shieldTimer = 600; // 10 seconds of invulnerability
                onShieldChange(true);
                addFloatingText(p.x, p.y - 25, 'BARRIER SHIELD [B]!', '#06b6d4');
              } else if (pod.itemType === 'R') {
                p.rapidFire = true;
                onRapidFireChange(true);
                addFloatingText(p.x, p.y - 25, 'RAPID FIRE [R]!', '#c084fc');
              }

              onScoreAdd(1000);
              s.pods.splice(i, 1);
              continue;
            }
          }

          // Offscreen check
          if (pod.x < s.cameraX - 100) {
            s.pods.splice(i, 1);
          }
        }

        // 8. Update Enemies & AI Shooting
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const enemy = s.enemies[i];
          enemy.animFrame += 0.15;
          enemy.x += enemy.vx;

          // Runner jumps or keeps running
          if (enemy.type === 'RUNNER') {
            if (enemy.x < s.cameraX - 60) {
              s.enemies.splice(i, 1);
              continue;
            }
          }

          // Enemy shooting AI
          enemy.shootTimer++;
          if (enemy.shootTimer >= enemy.shootCooldown) {
            enemy.shootTimer = 0;

            // Only shoot if roughly in camera view
            if (enemy.x > s.cameraX && enemy.x < s.cameraX + VIRTUAL_WIDTH) {
              const targetX = p.x + p.width / 2;
              const targetY = p.y + p.height / 2;
              const angle = Math.atan2(targetY - (enemy.y + 16), targetX - (enemy.x + 8));
              const bulletSpeed = enemy.isBoss ? 4.8 : 3.5;

              if (enemy.isBoss) {
                // Boss fires spread or volley of bullets
                [-0.2, 0, 0.2].forEach((spreadAngle) => {
                  s.bullets.push({
                    id: s.bulletIdCounter++,
                    x: enemy.x + 10,
                    y: enemy.y + 30 + Math.random() * 40,
                    vx: Math.cos(angle + spreadAngle) * bulletSpeed,
                    vy: Math.sin(angle + spreadAngle) * bulletSpeed,
                    radius: 5,
                    color: '#ef4444',
                    isPlayer: false,
                    damage: 1,
                  });
                });
              } else {
                s.bullets.push({
                  id: s.bulletIdCounter++,
                  x: enemy.x + (enemy.facing === 'left' ? -6 : enemy.width + 6),
                  y: enemy.y + 18,
                  vx: Math.cos(angle) * bulletSpeed,
                  vy: Math.sin(angle) * bulletSpeed,
                  radius: 4,
                  color: '#fb7185',
                  isPlayer: false,
                  damage: 1,
                });
              }
            }
          }

          // Physical enemy-player collision
          if (
            !p.isDead &&
            p.invincibleTimer === 0 &&
            p.x + p.width >= enemy.x &&
            p.x <= enemy.x + enemy.width &&
            p.y + p.height >= enemy.y &&
            p.y <= enemy.y + enemy.height
          ) {
            if (p.shieldTimer > 0) {
              // Shield damages enemy!
              enemy.hp -= 2;
              createExplosion(enemy.x, enemy.y, '#06b6d4', 8);
              soundManager.playEnemyHit();
              if (enemy.hp <= 0 && !enemy.isBoss) {
                s.enemies.splice(i, 1);
                onScoreAdd(enemy.scoreValue);
              }
            } else {
              p.lives--;
              onLivesChange(p.lives);
              createExplosion(p.x, p.y, '#ef4444', 24);
              soundManager.playExplosion('large');
              s.screenShake = 12;

              if (p.lives <= 0) {
                p.isDead = true;
                soundManager.playGameOver();
                setTimeout(() => onGameOver(), 1800);
              } else {
                p.invincibleTimer = 120;
                p.x = Math.max(s.cameraX + 40, p.x - 50);
              }
            }
          }
        }

        // 9. Update Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const part = s.particles[i];
          part.x += part.vx;
          part.y += part.vy;
          part.life += 1;
          if (part.life >= part.maxLife) {
            s.particles.splice(i, 1);
          }
        }

        // 10. Update Floating Texts
        for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
          const ft = s.floatingTexts[i];
          ft.y -= 0.8;
          ft.life -= 1;
          if (ft.life <= 0) {
            s.floatingTexts.splice(i, 1);
          }
        }

        // Screen shake decay
        if (s.screenShake > 0) s.screenShake *= 0.88;
        if (s.screenShake < 0.2) s.screenShake = 0;
      }

      // --- RENDERING PHASE ---
      const s = gameStateRef.current;
      const p = s.player;
      const camX = s.cameraX;

      ctx.save();

      // Screen shake translation
      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake;
        const shakeY = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Parallax Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      bgGrad.addColorStop(0, stage.bgGradTop);
      bgGrad.addColorStop(1, stage.bgGradBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // Distant mountains / structures (Parallax 0.2)
      ctx.fillStyle = stage.id === 1 ? '#065f46' : stage.id === 2 ? '#1e293b' : '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(0, 360);
      for (let x = 0; x <= VIRTUAL_WIDTH; x += 40) {
        const worldX = x + camX * 0.2;
        const h = Math.sin(worldX * 0.008) * 45 + Math.cos(worldX * 0.015) * 25 + 240;
        ctx.lineTo(x, h);
      }
      ctx.lineTo(VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      ctx.lineTo(0, VIRTUAL_HEIGHT);
      ctx.fill();

      // Midground trees / watchtowers / pipelines (Parallax 0.5)
      ctx.fillStyle = stage.id === 1 ? '#047857' : stage.id === 2 ? '#334155' : '#991b1b';
      for (let i = 0; i < 15; i++) {
        const treeX = ((i * 180) - (camX * 0.5)) % (VIRTUAL_WIDTH + 200) - 100;
        if (stage.id === 1) {
          // Jungle palms
          ctx.fillRect(treeX + 16, 220, 10, 160);
          ctx.beginPath();
          ctx.arc(treeX + 21, 210, 38, 0, Math.PI * 2);
          ctx.fill();
        } else if (stage.id === 2) {
          // Steel girders & waterfall sprays
          ctx.fillRect(treeX, 190, 18, 190);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(treeX + 4, 190, 10, 190);
          ctx.fillStyle = '#334155';
        } else {
          // Magma conduits
          ctx.fillRect(treeX + 10, 200, 16, 180);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(treeX + 14, 210, 8, 170);
          ctx.fillStyle = '#991b1b';
        }
      }

      // Foreground Ground & Catwalks
      ctx.fillStyle = stage.groundColor;
      ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - GROUND_Y);

      // Tech grid border on ground
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, 4);

      // 2. Draw Checkpoint Security Gates
      stage.checkpoints.forEach((gateX, idx) => {
        const screenGateX = gateX - camX;
        const isPassed = idx < activeCheckpointIndex;

        if (screenGateX >= -80 && screenGateX <= VIRTUAL_WIDTH + 80) {
          if (!isPassed) {
            // Active glowing high-tech energy gate
            const pulse = (Math.sin(s.timeInStage * 0.1) + 1) / 2;
            ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.4})`;
            ctx.fillRect(screenGateX - 10, 80, 20, GROUND_Y - 80);

            // Gate pylons
            ctx.fillStyle = '#18181b';
            ctx.fillRect(screenGateX - 18, 70, 36, 30);
            ctx.fillRect(screenGateX - 18, GROUND_Y - 30, 36, 30);

            // Neon glowing beams
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(screenGateX, 90);
            ctx.lineTo(screenGateX, GROUND_Y - 10);
            ctx.stroke();

            // Tactical barrier text
            ctx.save();
            ctx.font = 'bold 10px "Press Start 2P", monospace';
            ctx.fillStyle = '#fecaca';
            ctx.textAlign = 'center';
            ctx.fillText(`TRẠM ${idx + 1}/5`, screenGateX, 60);
            ctx.fillText('BẢO MẬT', screenGateX, 115);
            ctx.restore();
          } else {
            // Gate disabled/passed (green pylons)
            ctx.fillStyle = '#10b981';
            ctx.fillRect(screenGateX - 12, GROUND_Y - 15, 24, 15);
            ctx.font = '9px monospace';
            ctx.fillStyle = '#6ee7b7';
            ctx.textAlign = 'center';
            ctx.fillText(`TRẠM ${idx + 1} ✓`, screenGateX, GROUND_Y - 20);
          }
        }
      });

      // 3. Draw Flying Powerup Pods
      s.pods.forEach((pod) => {
        const podScreenX = pod.x - camX;
        if (podScreenX >= -40 && podScreenX <= VIRTUAL_WIDTH + 40) {
          if (!pod.isDropped) {
            // Flying Falcon Pod (Contra iconic winged drone)
            ctx.save();
            ctx.translate(podScreenX, pod.y);

            // Metallic Falcon Wings
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(-16, 0);
            ctx.lineTo(-26, -8);
            ctx.lineTo(-10, -4);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(16, 0);
            ctx.lineTo(26, -8);
            ctx.lineTo(10, -4);
            ctx.fill();

            // Core Orb
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
          } else {
            // Dropped weapon capsule with letter [S, M, L, B, R]
            ctx.save();
            ctx.translate(podScreenX, pod.y);

            const colors: Record<string, string> = {
              S: '#ef4444',
              M: '#f59e0b',
              L: '#0284c7',
              B: '#059669',
              R: '#9333ea',
            };

            ctx.fillStyle = colors[pod.itemType] || '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Letter
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pod.itemType, 0, 1);
            ctx.restore();
          }
        }
      });

      // 4. Draw Enemies & Boss
      s.enemies.forEach((enemy) => {
        const screenX = enemy.x - camX;
        if (screenX >= -150 && screenX <= VIRTUAL_WIDTH + 150) {
          ctx.save();
          ctx.translate(screenX, enemy.y);

          if (enemy.isBoss) {
            // Boss Rendering
            if (stage.id === 1) {
              // Boss 1: Fortress Defense Core
              ctx.fillStyle = '#3f3f46';
              ctx.fillRect(0, 0, enemy.width, enemy.height);

              // Glowing Eye Core
              const pulse = (Math.sin(s.timeInStage * 0.15) + 1) / 2;
              ctx.fillStyle = `rgb(${200 + pulse * 55}, 20, 20)`;
              ctx.beginPath();
              ctx.arc(enemy.width / 2, enemy.height / 2, 35, 0, Math.PI * 2);
              ctx.fill();

              // Dual Gun Barrels
              ctx.fillStyle = '#71717a';
              ctx.fillRect(-25, 30, 30, 12);
              ctx.fillRect(-25, enemy.height - 42, 30, 12);
            } else if (stage.id === 2) {
              // Boss 2: Twin-Turret Walking Mech
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(10, 10, enemy.width - 20, enemy.height - 20);

              // Cockpit visor
              ctx.fillStyle = '#38bdf8';
              ctx.fillRect(15, 30, 35, 20);

              // Heavy Twin Cannons
              ctx.fillStyle = '#94a3b8';
              ctx.fillRect(-30, 25, 40, 14);
              ctx.fillRect(-30, 75, 40, 14);
            } else {
              // Boss 3: Cyber Alien Overlord Brain
              ctx.fillStyle = '#701a75';
              ctx.beginPath();
              ctx.arc(enemy.width / 2, enemy.height / 2, 60, 0, Math.PI * 2);
              ctx.fill();

              // Alien Brain convolutions & cyber tubes
              ctx.strokeStyle = '#f43f5e';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.arc(enemy.width / 2 - 15, enemy.height / 2 - 10, 25, 0, Math.PI);
              ctx.stroke();

              // Glowing Cyclops Eye
              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              ctx.arc(enemy.width / 2, enemy.height / 2 + 10, 20, 0, Math.PI * 2);
              ctx.fill();
            }

            // Boss Health Bar above boss
            const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, -25, enemy.width, 10);
            ctx.fillStyle = hpPercent > 0.3 ? '#ef4444' : '#e11d48';
            ctx.fillRect(2, -23, (enemy.width - 4) * hpPercent, 6);

            ctx.font = 'bold 9px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(stage.bossName, enemy.width / 2, -32);
          } else {
            // Standard Minion Soldiers / Drones
            if (enemy.type === 'RUNNER') {
              // Red/Blue uniformed enemy soldier
              const runOffset = Math.sin(enemy.animFrame) * 4;
              ctx.fillStyle = '#dc2626'; // Red uniform
              ctx.fillRect(8, 12, 16, 22);

              // Head & Helmet
              ctx.fillStyle = '#7f1d1d';
              ctx.fillRect(10, 0, 12, 12);

              // Legs running
              ctx.fillStyle = '#1e3a8a';
              ctx.fillRect(8, 34, 6, 14 + runOffset);
              ctx.fillRect(18, 34, 6, 14 - runOffset);

              // Rifle
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(0, 18, 16, 5);
            } else if (enemy.type === 'DRONE') {
              // Flying combat drone
              ctx.fillStyle = '#475569';
              ctx.beginPath();
              ctx.arc(16, 16, 14, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(16, 16, 5, 0, Math.PI * 2);
              ctx.fill();

              // Hover blades
              ctx.strokeStyle = '#94a3b8';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(0, 8);
              ctx.lineTo(32, 8);
              ctx.stroke();
            } else {
              // Sniper / Flame bunker trooper
              ctx.fillStyle = '#b45309';
              ctx.fillRect(6, 10, 20, 24);
              ctx.fillStyle = '#78350f';
              ctx.fillRect(8, 0, 16, 10);
              ctx.fillStyle = '#1f2937';
              ctx.fillRect(-8, 16, 20, 6);
            }
          }

          ctx.restore();
        }
      });

      // 5. Draw Player (Contra Hero: Bill Rizer / Commando)
      if (!p.isDead) {
        const screenPlayerX = p.x - camX;
        // Blinking effect during invincibility frames
        if (p.invincibleTimer === 0 || Math.floor(s.timeInStage / 4) % 2 === 0) {
          ctx.save();
          ctx.translate(screenPlayerX, p.y);

          // Forcefield Shield Ring if active
          if (p.shieldTimer > 0) {
            ctx.save();
            const shieldSpin = s.timeInStage * 0.1;
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(p.width / 2, p.height / 2, 34, 0, Math.PI * 2);
            ctx.stroke();

            // Pulsing shield aura
            ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
            ctx.fill();

            // Rotating shield nodes
            for (let i = 0; i < 4; i++) {
              const nodeAngle = shieldSpin + (i * Math.PI) / 2;
              const nx = p.width / 2 + Math.cos(nodeAngle) * 34;
              const ny = p.height / 2 + Math.sin(nodeAngle) * 34;
              ctx.fillStyle = '#67e8f9';
              ctx.beginPath();
              ctx.arc(nx, ny, 4, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }

          // Iconic Contra Somersault Ball Animation while jumping!
          if (p.isJumping) {
            const rot = p.jumpFrame * (p.facing === 'right' ? 1 : -1);
            ctx.translate(p.width / 2, p.height / 2);
            ctx.rotate(rot);

            // Tucked body ball
            ctx.fillStyle = '#2563eb'; // Blue pants
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();

            // Torso flesh & red headband flying in spin
            ctx.fillStyle = '#fcd34d';
            ctx.beginPath();
            ctx.arc(-4, -4, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ef4444';
            ctx.fillRect(0, -14, 12, 5);
          } else {
            // Standing, Running or Crouching
            const isFacingRight = p.facing === 'right';

            if (p.isCrouching) {
              // Crouching soldier
              ctx.fillStyle = '#2563eb'; // Blue combat pants
              ctx.fillRect(isFacingRight ? 0 : 4, p.height - 18, 24, 18);

              // Muscular skin torso
              ctx.fillStyle = '#fcd34d';
              ctx.fillRect(isFacingRight ? 4 : 2, p.height - 28, 18, 12);

              // Head with RED HEADBAND
              ctx.fillStyle = '#fcd34d';
              ctx.fillRect(isFacingRight ? 10 : 0, p.height - 38, 14, 12);

              ctx.fillStyle = '#ef4444'; // Red headband
              ctx.fillRect(isFacingRight ? 8 : 0, p.height - 35, 18, 4);

              // Rifle pointing low
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(isFacingRight ? 18 : -14, p.height - 20, 24, 5);
            } else {
              // Standing / Running upright commando
              const runStep = Math.sin(p.animFrame) * 6;

              // Legs (Blue pants)
              ctx.fillStyle = '#2563eb';
              if (p.vx !== 0) {
                ctx.fillRect(isFacingRight ? 4 : 16, 32, 6, 16 + runStep);
                ctx.fillRect(isFacingRight ? 16 : 4, 32, 6, 16 - runStep);
              } else {
                ctx.fillRect(4, 32, 7, 16);
                ctx.fillRect(15, 32, 7, 16);
              }

              // Muscular torso (Tan / Buff)
              ctx.fillStyle = '#fcd34d';
              ctx.fillRect(6, 16, 16, 18);

              // Ammo bandolier across chest
              ctx.fillStyle = '#78350f';
              ctx.fillRect(7, 18, 14, 4);

              // Head with RED HEADBAND & Hair
              ctx.fillStyle = '#92400e'; // Hair
              ctx.fillRect(8, 0, 12, 6);

              ctx.fillStyle = '#fcd34d'; // Face
              ctx.fillRect(8, 6, 12, 10);

              ctx.fillStyle = '#ef4444'; // Red Headband
              ctx.fillRect(6, 4, 16, 4);

              // Headband tails blowing in the wind
              const trailX = isFacingRight ? -6 : 22;
              ctx.fillRect(trailX, 5, 8, 3);

              // Rifle aiming
              ctx.fillStyle = '#1e293b';
              if (p.aimDirection === 'up') {
                ctx.fillRect(isFacingRight ? 14 : 8, -12, 5, 26);
              } else if (p.aimDirection === 'up-diag') {
                ctx.save();
                ctx.translate(isFacingRight ? 16 : 6, 14);
                ctx.rotate(isFacingRight ? -Math.PI / 4 : Math.PI / 4);
                ctx.fillRect(0, -3, 24, 6);
                ctx.restore();
              } else {
                // Straight rifle
                ctx.fillRect(isFacingRight ? 14 : -12, 18, 24, 6);
              }
            }
          }

          ctx.restore();
        }
      }

      // 6. Draw Bullets
      s.bullets.forEach((b) => {
        const screenBx = b.x - camX;
        if (screenBx >= -20 && screenBx <= VIRTUAL_WIDTH + 20) {
          ctx.save();
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(screenBx, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();

          // Outer bullet glow
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      });

      // 7. Draw Particles
      s.particles.forEach((part) => {
        const screenPx = part.x - camX;
        const alpha = Math.max(0, 1 - part.life / part.maxLife);
        ctx.fillStyle = part.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(screenPx, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 8. Draw Floating Damage / Score Texts
      s.floatingTexts.forEach((ft) => {
        const screenTx = ft.x - camX;
        ctx.save();
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, screenTx, ft.y);
        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    stage,
    isPaused,
    isQuizActive,
    activeCheckpointIndex,
    inputState,
    firePlayerBullet,
    onScoreAdd,
    onLivesChange,
    onWeaponChange,
    onRapidFireChange,
    onShieldChange,
    onReachCheckpoint,
    onStageClear,
    onGameOver,
  ]);

  return (
    <div className="relative w-full aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/60 bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="w-full h-full object-contain block select-none cursor-crosshair"
      />
    </div>
  );
};
