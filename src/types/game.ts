export type WeaponType = 'NORMAL' | 'MACHINE' | 'SPREAD' | 'LASER';

export interface Question {
  id: string;
  stageId: number;
  questionNumber: number; // 1 to 5
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanationTopic: string; // Internal topic reference from SGK
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  isCrouching: boolean;
  facing: 'left' | 'right';
  aimDirection: 'straight' | 'up' | 'up-diag' | 'down-diag' | 'down';
  lives: number;
  score: number;
  weapon: WeaponType;
  rapidFire: boolean;
  shieldTimer: number; // in frames or seconds
  invincibleTimer: number;
  isJumping: boolean;
  jumpFrame: number;
  animFrame: number;
  isDead: boolean;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isPlayer: boolean;
  damage: number;
  piercing?: boolean;
}

export type EnemyType = 
  | 'RUNNER' 
  | 'SNIPER' 
  | 'TURRET' 
  | 'DRONE' 
  | 'FLAME_THROWER' 
  | 'BOSS_CORE_1' 
  | 'BOSS_MECH_2' 
  | 'BOSS_ALIEN_3';

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  scoreValue: number;
  shootCooldown: number;
  shootTimer: number;
  facing: 'left' | 'right';
  animFrame: number;
  state?: string;
  isBoss?: boolean;
}

export interface PowerUpPod {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  itemType: 'S' | 'M' | 'L' | 'B' | 'R';
  hp: number;
  isDropped: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export interface CheckpointGate {
  id: number;
  x: number;
  passed: boolean;
  questionIndex: number; // 0..4
  name: string;
}

export interface StageData {
  id: number;
  name: string;
  subtitle: string;
  themeColor: string;
  bgGradTop: string;
  bgGradBottom: string;
  groundColor: string;
  length: number;
  bossName: string;
  bossHp: number;
  checkpoints: number[]; // X-positions of 5 checkpoints
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  stageReached: number;
  firstTryAnswers: number; // Out of total answered
  timeElapsedSeconds: number;
  date: string;
}
