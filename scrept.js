function createSkyElements() {
                  const container = document.getElementById('game-container');
                  
                  // Create clouds with different speeds
                  for (let i = 0; i < 8; i++) {
                      const cloud = document.createElement('div');
                      cloud.className = 'cloud';
                      cloud.style.left = Math.random() * 100 + 'vw';
                      cloud.style.top = Math.random() * 30 + 5 + 'vh';
                      cloud.style.width = Math.random() * 150 + 100 + 'px';
                      cloud.style.height = Math.random() * 40 + 20 + 'px';
                      const duration = Math.random() * 20 + 20;
                      cloud.style.animation = `moveCloud ${duration}s linear infinite`;
                      container.appendChild(cloud);
                  }
                  
                  // Create grass
                  for (let i = 0; i < 100; i++) {
                      const grass = document.createElement('div');
                      grass.className = 'grass';
                      grass.style.left = Math.random() * 100 + 'vw';
                      grass.style.height = Math.random() * 10 + 10 + 'px';
                      grass.style.animationDelay = Math.random() + 's';
                      container.appendChild(grass);
                  }
                  
                  // Create shooting stars
                  setInterval(() => {
                      const star = document.createElement('div');
                      star.className = 'shooting-star';
                      star.style.top = Math.random() * 30 + 'vh';
                      star.style.left = Math.random() * 100 + 'vw';
                      container.appendChild(star);
                      
                      const duration = Math.random() * 1 + 1;
                      star.style.animation = `shootingStar ${duration}s linear forwards`;
                      
                      setTimeout(() => star.remove(), duration * 1000);
                  }, 2000);
              }
              
              createSkyElements();
      
              const robot = document.getElementById('robot');
              const enemy = document.getElementById('enemy');
              const gameContainer = document.getElementById('game-container');
              const customizationMenu = document.getElementById('customization-menu');
              let gameStarted = false;
              let bullets = [];
              let score = 0;
              let isGameOver = false;
              
              // Add these variables to control robot movement
              let canMoveRobot = true;
              const robotSpeed = 5;
              const robotBoundaryPadding = 50;
              let keysPressed = {};
              let robotPositionX = 20; // Initial position in percentage
              let robotPositionY = 25; // Initial position in percentage
      
              // Add these variables after the other declarations at the top
              let enemies = [];
              let enemyBullets = [];
              const MAX_ENEMIES = 3;
              const ENEMY_SPAWN_INTERVAL = 3000;
      
              // Add these variables after other declarations
              let gameDifficulty = 'medium'; // default difficulty
              const DIFFICULTY_SETTINGS = {
                  easy: {
                      enemyShootInterval: 2000,  // 2 seconds
                      enemyBulletSpeed: 4,
                      maxEnemies: 2,
                      enemySpeed: 1  // Slower enemy movement
                  },
                  medium: {
                      enemyShootInterval: 1000,  // 1 second
                      enemyBulletSpeed: 5,
                      maxEnemies: 3,
                      enemySpeed: 1.5
                  },
                  hard: {
                      enemyShootInterval: 50,    // Current behavior (frequent shooting)
                      enemyBulletSpeed: 7,       // Current speed
                      maxEnemies: 3,             // Current max enemies
                      enemySpeed: 2              // Current enemy movement speed
                  }
              };
      
              function startCustomGame() {
                  if (gameStarted) return;
                  
                  const nameInput = document.getElementById('name-input');
                  const colorInput = document.getElementById('color-input');
                  const movementToggle = document.getElementById('movement-toggle');
                  const difficultySelect = document.getElementById('difficulty-select');
                  
                  // Set game settings
                  gameDifficulty = difficultySelect.value;
                  const robotName = nameInput.value.trim() || 'Combat Bot';
                  const robotColor = colorInput.value;
                  
                  // Initialize game state
                  gameStarted = true;
                  isGameOver = false;
                  enemies = [];
                  enemyBullets = [];
                  
                  // Update robot name display
                  const robotNameElement = document.getElementById('robot-name');
                  if (robotNameElement) {
                      robotNameElement.textContent = robotName;
                  }
                  
                  // Update robot color
                  const robotBody = document.querySelector('.robot-body');
                  if (robotBody) {
                      robotBody.style.backgroundColor = robotColor;
                  }
                  
                  // Hide customization menu
                  if (customizationMenu) {
                      customizationMenu.style.display = 'none';
                  }
                  
                  // Start game mechanics
                  startEnemyMovement();
                  gameLoop(); // Start the game loop
              }
      
              function createGameUI() {
                  const scoreDisplay = document.createElement('div');
                  scoreDisplay.id = 'score-display';
                  scoreDisplay.style.cssText = `
                      position: absolute;
                      top: 20px;
                      right: 20px;
                      color: white;
                      font-size: 24px;
                      text-shadow: 0 0 10px rgba(74, 144, 226, 0.8);
                  `;
                  gameContainer.appendChild(scoreDisplay);
                  updateScore(0);
              }
      
              function updateScore(newScore) {
                  score = newScore;
                  document.getElementById('score-display').textContent = `Score: ${score}`;
                  
                  // Check for victory condition
                  if (score >= 1000) {
                      handleVictory();
                  }
              }
      
              function aimRobot(e) {
                  if (!gameStarted || isGameOver) return;
                  
                  const robotRect = robot.getBoundingClientRect();
                  const robotCenterX = robotRect.left + robotRect.width / 2;
                  const robotCenterY = robotRect.top + robotRect.height / 2;
                  
                  // Calculate angle between robot and mouse
                  const angle = Math.atan2(
                      e.clientY - robotCenterY,
                      e.clientX - robotCenterX
                  ) * 180 / Math.PI;
                  
                  // Update robot arm rotation
                  const robotArm = document.querySelector('.robot-arm');
                  robotArm.style.transform = `rotate(${angle}deg)`;
              }
      
              // Add this function to update robot position based on keyboard input
              function updateRobotPosition() {
    if (!gameStarted || isGameOver || !canMoveRobot) return;
    function createEnemyBullet(enemy) {
        const bullet = document.createElement('div');
        bullet.className = 'enemy-bullet';
        
        const robotRect = robot.getBoundingClientRect();
        const enemyRect = enemy.element.getBoundingClientRect();
        
        // Calculate bullet trajectory towards robot
        const enemyCenterX = enemyRect.left + enemyRect.width / 2;
        const enemyCenterY = enemyRect.top + enemyRect.height / 2;
        const robotCenterX = robotRect.left + robotRect.width / 2;
        const robotCenterY = robotRect.top + robotRect.height / 2;
        
        const angle = Math.atan2(
            robotCenterY - enemyCenterY,
            robotCenterX - enemyCenterX
        );
        
        bullet.style.left = `${enemyCenterX}px`;
        bullet.style.top = `${enemyCenterY}px`;
        bullet.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
        
        gameContainer.appendChild(bullet);
        
        // Add bullet to enemyBullets array with movement properties
        enemyBullets.push({
            element: bullet,
            x: enemyCenterX,
            y: enemyCenterY,
            dx: Math.cos(angle) * 7, // Bullet speed
            dy: Math.sin(angle) * 7
        });
    }
    
    // Add this function to update enemy bullets
    function updateEnemyBullets() {
        enemyBullets.forEach((bullet, index) => {
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
            
            bullet.element.style.left = `${bullet.x}px`;
            bullet.element.style.top = `${bullet.y}px`;
            
            // Remove bullets that are off screen
            if (bullet.x < 0 || bullet.x > window.innerWidth || 
                bullet.y < 0 || bullet.y > window.innerHeight) {
                bullet.element.remove();
                enemyBullets.splice(index, 1);
                return;
            }
            
            // Check for collision with robot
            const bulletRect = bullet.element.getBoundingClientRect();
            const robotRect = robot.getBoundingClientRect();
            
            if (bulletRect.left < robotRect.right &&
                bulletRect.right > robotRect.left &&
                bulletRect.top < robotRect.bottom &&
                bulletRect.bottom > robotRect.top) {
                // Robot hit!
                handleRobotHit();
                bullet.element.remove();
                enemyBullets.splice(index, 1);
            }
        });
    }
    
    // Get current position
    const currentLeft = parseFloat(robot.style.left) || robotPositionX;
    const currentBottom = parseFloat(robot.style.bottom) || robotPositionY;
    
    // Calculate new position based on keys pressed
    let newLeft = currentLeft;
    let newBottom = currentBottom;
    
    // Check for WASD or arrow keys
    if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) {
        newLeft -= robotSpeed * 0.1;
    }
    if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) {
        newLeft += robotSpeed * 0.1;
    }
    if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) {
        newBottom += robotSpeed * 0.1;
    }
    if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) {
        newBottom -= robotSpeed * 0.1;
    }
    
    // Apply boundaries
    newLeft = Math.max(robotBoundaryPadding / window.innerWidth * 100, 
            Math.min(100 - robotBoundaryPadding / window.innerWidth * 100, newLeft));
    
    // Restrict vertical movement to grass area (between 5vh and 25vh from bottom)
    newBottom = Math.max(5, Math.min(20, newBottom)); // Keep robot within grass area
    
    // Update robot position
    robot.style.left = `${newLeft}%`;
    robot.style.bottom = `${newBottom}%`;
    
    // Store current position
    robotPositionX = newLeft;
    robotPositionY = newBottom;
}
              function shootBullet(e) {
                  if (!gameStarted || isGameOver) return;
                  
                  const bullet = document.createElement('div');
                  bullet.className = 'bullet';
                  const trail = document.createElement('div');
                  trail.className = 'bullet-trail';
                  
                  const robotRect = robot.getBoundingClientRect();
                  const robotCenterX = robotRect.left + robotRect.width / 2;
                  const robotCenterY = robotRect.top + robotRect.height / 2;
                  
                  // Calculate bullet trajectory
                  const angle = Math.atan2(
                      e.clientY - robotCenterY,
                      e.clientX - robotCenterX
                  );
                  
                  bullet.style.left = `${robotCenterX}px`;
                  bullet.style.top = `${robotCenterY}px`;
                  bullet.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
                  
                  gameContainer.appendChild(bullet);
                  gameContainer.appendChild(trail);
                  
                  // Animate bullet
                  const speed = 10;
                  const dx = Math.cos(angle) * speed;
                  const dy = Math.sin(angle) * speed;
                  
                  bullets.push({
                      element: bullet,
                      trail: trail,
                      x: robotCenterX,
                      y: robotCenterY,
                      dx: dx,
                      dy: dy
                  });
              }
      
              function updateBullets() {
                  bullets.forEach((bullet, index) => {
                      bullet.x += bullet.dx;
                      bullet.y += bullet.dy;
                      
                      bullet.element.style.left = `${bullet.x}px`;
                      bullet.element.style.top = `${bullet.y}px`;
                      bullet.trail.style.left = `${bullet.x - 30}px`;
                      bullet.trail.style.top = `${bullet.y}px`;
                      bullet.trail.style.transform = bullet.element.style.transform;
                      
                      // Remove bullets that are off screen
                      if (bullet.x < 0 || bullet.x > window.innerWidth || 
                          bullet.y < 0 || bullet.y > window.innerHeight) {
                          bullet.element.remove();
                          bullet.trail.remove();
                          bullets.splice(index, 1);
                      }
                      
                      // Check for collision with enemy
                      checkBulletCollision(bullet);
                  });
              }
      
              function startEnemyMovement() {
                  createEnemy();
                  
                  setInterval(() => {
                      if (enemies.length < DIFFICULTY_SETTINGS[gameDifficulty].maxEnemies && !isGameOver) {
                          createEnemy();
                      }
                  }, ENEMY_SPAWN_INTERVAL);
                  
                  moveEnemies();
              }
      
              function moveEnemies() {
                  if (!gameStarted || isGameOver) return;
                  
                  for (let i = enemies.length - 1; i >= 0; i--) {
                      const enemy = enemies[i];
                      enemy.x -= enemy.speed;
                      enemy.element.style.left = `${enemy.x}px`;
                      
                      // Adjust shooting probability based on difficulty
                      if (!isGameOver && Math.random() < (1 / (DIFFICULTY_SETTINGS[gameDifficulty].enemyShootInterval / 16.67))) {
                          createEnemyBullet(enemy);
                      }
                      
                      if (enemy.x < -200) {
                          enemy.element.remove();
                          enemies.splice(i, 1);
                      }
                  }
                  
                  requestAnimationFrame(moveEnemies);
              }
      
              function createEnemy() {
                  const enemyDiv = document.createElement('div');
                  enemyDiv.className = 'enemy';
                  enemyDiv.innerHTML = `
                      <div class="aircraft">
                          <div class="aircraft-wing"></div>
                          <div class="aircraft-body"></div>
                          <div class="aircraft-window"></div>
                          <div class="engine-glow" style="left: 10px; top: 45%;"></div>
                          <div class="engine-glow" style="right: 10px; top: 45%;"></div>
                      </div>
                  `;
                  
                  const enemyX = window.innerWidth;
                  const enemyY = Math.random() * (window.innerHeight * 0.6);
                  enemyDiv.style.left = `${enemyX}px`;
                  enemyDiv.style.top = `${enemyY}px`;
                  
                  gameContainer.appendChild(enemyDiv);
                  
                  enemies.push({
                      element: enemyDiv,
                      x: enemyX,
                      y: enemyY,
                      speed: (1 + Math.random()) * DIFFICULTY_SETTINGS[gameDifficulty].enemySpeed
                  });
              }
      
              function createEnemyBullet(enemy) {
                  const bullet = document.createElement('div');
                  bullet.className = 'enemy-bullet';
                  
                  const robotRect = robot.getBoundingClientRect();
                  const enemyRect = enemy.element.getBoundingClientRect();
                  
                  const enemyCenterX = enemyRect.left + enemyRect.width / 2;
                  const enemyCenterY = enemyRect.top + enemyRect.height / 2;
                  const robotCenterX = robotRect.left + robotRect.width / 2;
                  const robotCenterY = robotRect.top + robotRect.height / 2;
                  
                  const angle = Math.atan2(
                      robotCenterY - enemyCenterY,
                      robotCenterX - enemyCenterX
                  );
                  
                  bullet.style.left = `${enemyCenterX}px`;
                  bullet.style.top = `${enemyCenterY}px`;
                  bullet.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
                  
                  gameContainer.appendChild(bullet);
                  
                  enemyBullets.push({
                      element: bullet,
                      x: enemyCenterX,
                      y: enemyCenterY,
                      dx: Math.cos(angle) * DIFFICULTY_SETTINGS[gameDifficulty].enemyBulletSpeed,
                      dy: Math.sin(angle) * DIFFICULTY_SETTINGS[gameDifficulty].enemyBulletSpeed
                  });
              }
      
              function updateEnemyBullets() {
                  for (let i = enemyBullets.length - 1; i >= 0; i--) {
                      const bullet = enemyBullets[i];
                      bullet.x += bullet.dx;
                      bullet.y += bullet.dy;
                      
                      bullet.element.style.left = `${bullet.x}px`;
                      bullet.element.style.top = `${bullet.y}px`;
                      
                      if (bullet.x < 0 || bullet.x > window.innerWidth || 
                          bullet.y < 0 || bullet.y > window.innerHeight) {
                          bullet.element.remove();
                          enemyBullets.splice(i, 1);
                          continue;
                      }
                      
                      const bulletRect = bullet.element.getBoundingClientRect();
                      const robotRect = robot.getBoundingClientRect();
                      
                      if (!isGameOver && bulletRect.left < robotRect.right &&
                          bulletRect.right > robotRect.left &&
                          bulletRect.top < robotRect.bottom &&
                          bulletRect.bottom > robotRect.top) {
                          handleRobotHit();
                          bullet.element.remove();
                          enemyBullets.splice(i, 1);
                      }
                  }
              }
      
              function checkBulletCollision(bullet) {
                  // Loop through all enemies to check for collisions
                  enemies.forEach((enemy, enemyIndex) => {
                      const bulletRect = bullet.element.getBoundingClientRect();
                      const enemyRect = enemy.element.getBoundingClientRect();
                      
                      if (bulletRect.left < enemyRect.right &&
                          bulletRect.right > enemyRect.left &&
                          bulletRect.top < enemyRect.bottom &&
                          bulletRect.bottom > enemyRect.top) {
                          
                          // Create explosion at enemy position
                          createExplosion(enemyRect);
                          
                          // Update score
                          updateScore(score + 100);
                          
                          // Remove the enemy
                          enemy.element.remove();
                          enemies.splice(enemyIndex, 1);
                          
                          // Remove the bullet
                          bullet.element.remove();
                          bullet.trail.remove();
                          bullets = bullets.filter(b => b !== bullet);
                      }
                  });
              }
      
              function createExplosion(rect) {
                  const explosion = document.createElement('div');
                  explosion.className = 'explosion';
                  explosion.style.left = `${rect.left}px`;
                  explosion.style.top = `${rect.top}px`;
                  
                  // Create main explosion ring
                  const ring = document.createElement('div');
                  ring.className = 'explosion-ring';
                  explosion.appendChild(ring);
                  
                  // Create shockwave
                  const shockwave = document.createElement('div');
                  shockwave.className = 'explosion-shockwave';
                  explosion.appendChild(shockwave);
                  
                  // Create particle debris
                  for (let i = 0; i < 30; i++) {
                      const particle = document.createElement('div');
                      particle.className = 'explosion-particle';
                      
                      // Randomize particle colors between orange, yellow and white for Star Wars feel
                      const colors = ['#ff6700', '#ffbb00', '#ffffff'];
                      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                      
                      const angle = Math.random() * Math.PI * 2;
                      const speed = Math.random() * 6 + 3;
                      const distance = Math.random() * 80 + 40;
                      const size = Math.random() * 6 + 2;
                      
                      particle.style.width = `${size}px`;
                      particle.style.height = `${size}px`;
                      particle.style.left = '50%';
                      particle.style.top = '50%';
                      particle.style.transform = 'translate(-50%, -50%)';
                      
                      explosion.appendChild(particle);
                      
                      // Animate particle with Star Wars style - longer trails and arc patterns
                      const animation = particle.animate([
                          { 
                              transform: 'translate(-50%, -50%) scale(1)',
                              opacity: 1 
                          },
                          { 
                              transform: `translate(
                                  ${Math.cos(angle) * distance - 50}%,
                                  ${Math.sin(angle) * distance - 50}%) scale(0.5)`,
                              opacity: 0 
                          }
                      ], {
                          duration: Math.random() * 1000 + 800,
                          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                      });
                      
                      animation.onfinish = () => particle.remove();
                  }
                  
                  // Add explosion sound effect
                  const explosionSound = new Audio();
                  explosionSound.src = 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAHsQCAgICAgICAgICAgICAgICAgICAgICAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP////////////////////////////////8AAAA5TEFNRTMuOTlyAaUAAAAALGEAABRGJAMwSQAARgAAB7GtJfHPAAAAAAAAAAAAAAAAAAAA//tQxAAAAzUMUFEJMwmMIOyjKQa2MDAwMDAwMDAwMDVTEFNUUFRSUlJSUlIpA/i2F4wDFB/PK31XfDAYDBiGEhSRIkTAwMDAqtA//4LwfD87//gmB8PhcPh9aqoAABhDCBQAAAABAgFX+P/+f5/58/n/eeecPnz5eQoZECJLJymZKFkCYYaLSFAMv//NwTVDXjC/wQ7wWiAgYEGYNJAgQGDoaQkCJDAj4VbLOOxS3Lkh2TKHC0NJR45//qCWCfK2rkjAu3//8oCGaJmKWrYDDN';
                  explosionSound.volume = 0.4;
                  explosionSound.play().catch(e => console.log("Audio play prevented by browser policy"));
                  
                  gameContainer.appendChild(explosion);
                  setTimeout(() => explosion.remove(), 1500);
              }
      
              function resetEnemy() {
                  // Create a small explosion effect where the enemy was hit
                  const enemyRect = enemy.getBoundingClientRect();
                  
                  // Hide the enemy immediately
                  enemy.style.display = 'none';
                  
                  // Add a timeout before respawning
                  setTimeout(() => {
                      // Reset position to
                      // Reset enemy position to the right side of the screen
      enemy.style.left = `${window.innerWidth}px`;
      enemy.style.top = `${Math.random() * (window.innerHeight * 0.6)}px`;
      
      // Show enemy again
      enemy.style.display = 'block';
      }, 1000);
      }
      
      // Update the gameLoop function to include enemy bullets
      function gameLoop() {
        if (!gameStarted || isGameOver) return;
        
        updateBullets();
        updateEnemyBullets();
        updateRobotPosition();
        
        if (!isGameOver) {
            requestAnimationFrame(gameLoop);
        }
    }
    
      
      function initGame() {
          createSkyElements();
          customizationMenu.style.display = 'block';
      }
      
      // Add shooting star animation
      const style = document.createElement('style');
      style.innerHTML = `
      @keyframes shootingStar {
          0% {
              opacity: 1;
              transform: translateX(0) translateY(0) rotate(45deg);
          }
          100% {
              opacity: 0;
              transform: translateX(-150px) translateY(150px) rotate(45deg);
          }
      }`;
      document.head.appendChild(style);
      
      // Start the game loop when the game starts
      document.addEventListener('DOMContentLoaded', () => {
          initGame();
          createGameUI(); // Make sure score display is created
      });
      
      // Add keyboard event listeners for robot movement
      document.addEventListener('keydown', (e) => {
          keysPressed[e.key] = true;
      });
      
      document.addEventListener('keyup', (e) => {
          keysPressed[e.key] = false;
      });
      
      // Add mouse event listeners for aiming and shooting
      document.addEventListener('mousemove', aimRobot);
      document.addEventListener('click', shootBullet);
      
      function handleRobotHit() {
          if (isGameOver) return; // Prevent multiple hits
          
          const robotRect = robot.getBoundingClientRect();
          createExplosion(robotRect);
          isGameOver = true;
          
          // Clean up all enemy bullets
          enemyBullets.forEach(bullet => {
              bullet.element.remove();
          });
          enemyBullets = [];
          
          // Create and show game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.className = 'game-over-message';
          gameOverMessage.innerHTML = `
              <h2>Game Over!</h2>
              <p>Final Score: ${score}</p>
              <button onclick="location.reload()">Play Again</button>
          `;
          gameContainer.appendChild(gameOverMessage);
          
          // Make sure the message is visible
          gameOverMessage.style.display = 'block';
          gameOverMessage.style.zIndex = '1000';
      }
      
      // Add this new function for handling victory
      function handleVictory() {
          if (isGameOver) return;
          
          isGameOver = true;
          
          // Clean up all enemy bullets
          enemyBullets.forEach(bullet => {
              bullet.element.remove();
          });
          enemyBullets = [];
          
          // Clean up all enemies
          enemies.forEach(enemy => {
              enemy.element.remove();
          });
          enemies = [];
          
          // Create victory message
          const victoryMessage = document.createElement('div');
          victoryMessage.className = 'game-over-message victory';
          victoryMessage.innerHTML = `
              <h2>Victory!</h2>
              <p>You Saved the World!</p>
              <p>Final Score: ${score}</p>
              <button onclick="location.reload()">Play Again</button>
          `;
          gameContainer.appendChild(victoryMessage);
          
          // Make sure the message is visible
          victoryMessage.style.display = 'block';
          victoryMessage.style.zIndex = '1000';
      }
	