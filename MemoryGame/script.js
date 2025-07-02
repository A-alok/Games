class MemoryScapeGame {
  constructor() {
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.gameStartTime = null
    this.gameTimer = null
    this.soundEnabled = true
    this.musicEnabled = true
    this.isGameActive = false

    this.difficultyLevels = {
      easy: { rows: 3, cols: 4, pairs: 6, ratingBuffer: 6 }, // 12 cards
      medium: { rows: 4, cols: 6, pairs: 12, ratingBuffer: 10 }, // 24 cards
      hard: { rows: 5, cols: 8, pairs: 20, ratingBuffer: 16 }, // 40 cards
    }
    this.currentDifficulty = "medium" // Default difficulty

    // Enhanced Unicode characters for "stickers"
    this.cardEmojis = [
      { emoji: "🔮", id: 1, name: "Crystal Orb" },
      { emoji: "🌌", id: 2, name: "Cosmic Vortex" },
      { emoji: "🌑", id: 3, name: "Dark Moon" },
      { emoji: "👻", id: 4, name: "Phantom Spirit" },
      { emoji: "👽", id: 5, name: "Alien Being" },
      { emoji: "🦇", id: 6, name: "Nocturnal Bat" },
      { emoji: "🕷️", id: 7, name: "Creepy Spider" },
      { emoji: "🦉", id: 8, name: "Wise Owl" },
      { emoji: "🗝️", id: 9, name: "Ancient Key" },
      { emoji: "🕯️", id: 10, name: "Flickering Candle" },
      { emoji: "🖤", id: 11, name: "Shadow Heart" },
      { emoji: "💀", id: 12, name: "Haunted Skull" },
      { emoji: "🌙", id: 13, name: "Mystic Crescent" },
      { emoji: "✨", id: 14, name: "Ethereal Sparkles" },
      { emoji: "🌀", id: 15, name: "Hypnotic Swirl" },
      { emoji: "⚰️", id: 16, name: "Sealed Coffin" },
      { emoji: "⚱️", id: 17, name: "Mysterious Urn" },
      { emoji: "🪦", id: 18, name: "Forgotten Gravestone" },
      { emoji: "⛓️", id: 19, name: "Broken Chains" },
      { emoji: "🪞", id: 20, name: "Enchanted Mirror" },
      { emoji: "🥀", id: 21, name: "Withered Rose" },
      { emoji: "🌫️", id: 22, name: "Dense Fog" },
      { emoji: "🌘", id: 23, name: "Waning Moon" },
      { emoji: "👁️‍🗨️", id: 24, name: "All-Seeing Eye" },
    ]

    // Open source dark-themed pictures to discover
    this.hiddenPictures = [
      {
        name: "Starry Night Sky",
        description: "A vast expanse of stars and nebulae in the deep night sky.",
        image: "https://images.unsplash.com/photo-1508615070457-7ba837939540?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Misty Forest at Dusk",
        description: "Ancient trees shrouded in an ethereal mist as night falls.",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Dark Ocean Waves",
        description: "Powerful waves crashing under a moody, moonlit sky.",
        image: "https://images.unsplash.com/photo-1509233725247-49e654c54825?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Neon Cityscape at Night",
        description: "Vibrant city lights reflecting on wet streets after a rain.",
        image: "https://images.unsplash.com/photo-1494500764485-c902910e5854?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Mysterious Aurora Borealis",
        description: "Green and purple lights dancing across a dark, snowy landscape.",
        image: "https://images.unsplash.com/photo-1516483147564-ff215b77957f?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Moody Mountain Range",
        description: "Dramatic peaks silhouetted against a twilight sky.",
        image: "https://images.unsplash.com/photo-1518098268026-c232f397cd77?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Enigmatic Cave Entrance",
        description: "A dark, inviting cave opening with a hint of light within.",
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Moonlit Forest Path",
        description: "A winding path through a dense forest illuminated by moonlight.",
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Stormy Sky Over Lake",
        description: "Dark, brooding clouds gathering over a calm lake before a storm.",
        image: "https://images.unsplash.com/photo-1534274988757-ce232b96a6dc?w=800&h=600&fit=crop&crop=center",
      },
    ]

    this.currentPicture = this.getRandomPicture()

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.createFloatingParticles()
    this.setDifficulty(this.currentDifficulty) // Set initial difficulty
    this.startBackgroundMusic()
    this.addCustomAnimations()
    this.showScreen("startScreen") // Start on the start screen
  }

  setupEventListeners() {
    document.getElementById("startGameBtn").addEventListener("click", () => this.startGame())
    document.getElementById("soundToggle").addEventListener("click", () => this.toggleSound())
    document.getElementById("musicToggle").addEventListener("click", () => this.toggleMusic())
    document.getElementById("resetGame").addEventListener("click", () => this.startGame()) // Reset goes to start game
    document.getElementById("playAgain").addEventListener("click", () => this.startGame()) // Play Again goes to start game
    document.getElementById("shareScore").addEventListener("click", () => this.shareScore())
    document.getElementById("difficulty").addEventListener("change", (e) => this.setDifficulty(e.target.value))
  }

  showScreen(screenId) {
    const mainSlider = document.getElementById("mainSlider")
    const screen = document.getElementById(screenId)
    if (mainSlider && screen) {
      mainSlider.scrollTo({
        left: screen.offsetLeft,
        behavior: "smooth",
      })
    }
  }

  startGame() {
    this.startNewGame()
    this.showScreen("gameScreen")
  }

  createFloatingParticles() {
    const container = document.getElementById("particles-container")
    const particles = ["✨", "💫", "🌟", "🔮", "🌌", "🌑", "🌙", "🌀"] // Darker/mysterious particles

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      this.createParticle(container, particles)
    }

    // Continuously create new particles
    setInterval(() => {
      if (container.children.length < 25) {
        this.createParticle(container, particles)
      }
    }, 2500)
  }

  createParticle(container, particles) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.textContent = particles[Math.floor(Math.random() * particles.length)]
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDuration = Math.random() * 10 + 10 + "s"
    particle.style.animationDelay = Math.random() * 3 + "s"
    particle.style.fontSize = Math.random() * 15 + 15 + "px"

    container.appendChild(particle)

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    }, 15000)
  }

  getRandomPicture() {
    return this.hiddenPictures[Math.floor(Math.random() * this.hiddenPictures.length)]
  }

  setDifficulty(level) {
    this.currentDifficulty = level
    const { rows, cols, pairs } = this.difficultyLevels[level]
    this.gridRows = rows
    this.gridCols = cols
    this.totalCards = rows * cols
    this.totalPairs = pairs

    // Update CSS grid properties dynamically
    const gameGrid = document.getElementById("gameGrid")
    gameGrid.style.gridTemplateColumns = `repeat(${this.gridCols}, 1fr)`
    gameGrid.style.gridTemplateRows = `repeat(${this.gridRows}, 1fr)`
    gameGrid.style.aspectRatio = `${this.gridCols} / ${this.gridRows}`

    // If game is active, restart with new difficulty
    if (this.isGameActive) {
      this.startNewGame()
    }
  }

  startNewGame() {
    this.resetGameState()
    this.currentPicture = this.getRandomPicture()
    this.setupHiddenPicture()
    this.createCards()
    this.shuffleCards()
    this.renderCards()
    this.gameStartTime = Date.now()
    this.isGameActive = true
    this.startGameTimer()
    this.animateGameStart()
  }

  resetGameState() {
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.updateStats()
    this.stopVictoryMusic()
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
    }
    // Reset reveal overlay opacity
    const overlay = document.getElementById("revealOverlay")
    if (overlay) overlay.style.opacity = "0"
  }

  setupHiddenPicture() {
    const hiddenPicture = document.getElementById("hiddenPicture")
    hiddenPicture.style.backgroundImage = `url(${this.currentPicture.image})`
  }

  createCards() {
    const cardPairs = []
    // Select a subset of emojis based on the number of pairs needed for the current difficulty
    const availableEmojis = [...this.cardEmojis].sort(() => 0.5 - Math.random()) // Shuffle emojis
    const selectedEmojis = availableEmojis.slice(0, this.totalPairs)

    // Create pairs from the selected emojis
    for (let i = 0; i < this.totalPairs; i++) {
      const emoji = selectedEmojis[i]
      cardPairs.push({ ...emoji }, { ...emoji })
    }
    this.cards = cardPairs
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  renderCards() {
    const gameGrid = document.getElementById("gameGrid")
    gameGrid.innerHTML = ""

    this.cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index)
      gameGrid.appendChild(cardElement)
    })
  }

  createCardElement(card, index) {
    const cardDiv = document.createElement("div")
    cardDiv.className = "card"
    cardDiv.dataset.index = index
    cardDiv.dataset.id = card.id
    cardDiv.title = `Card: ${card.name}`

    cardDiv.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          ❓
        </div>
        <div class="card-back">
          ${card.emoji}
        </div>
      </div>
    `

    cardDiv.addEventListener("click", () => this.handleCardClick(cardDiv, index))

    return cardDiv
  }

  animateGameStart() {
    const cards = document.querySelectorAll(".card")
    cards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "scale(0.5) rotateY(-90deg)"

      setTimeout(() => {
        card.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        card.style.opacity = "1"
        card.style.transform = "scale(1) rotateY(0deg)"
      }, index * 40) // Staggered animation
    })
  }

  handleCardClick(cardElement, index) {
    if (!this.isGameActive) return
    if (cardElement.classList.contains("flipped") || cardElement.classList.contains("matched")) return
    if (this.flippedCards.length >= 2) return

    this.flipCard(cardElement, index)
    this.playSound("flip")
    this.createClickEffect(cardElement)

    if (this.flippedCards.length === 2) {
      this.moves++
      this.updateStats()
      setTimeout(() => this.checkMatch(), 1200) // Longer delay for smoother feel
    }
  }

  flipCard(cardElement, index) {
    cardElement.classList.add("flipped")
    this.flippedCards.push({ element: cardElement, index, id: this.cards[index].id })

    // Add subtle bounce on flip
    cardElement.style.transform = "scale(1.05)"
    setTimeout(() => {
      cardElement.style.transform = "scale(1)"
    }, 200)
  }

  createClickEffect(cardElement) {
    const effect = document.createElement("div")
    effect.innerHTML = "✨"
    effect.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
      pointer-events: none;
      animation: clickEffect 0.8s ease-out forwards;
      z-index: 15;
    `

    cardElement.appendChild(effect)

    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect)
      }
    }, 800)
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards

    if (card1.id === card2.id) {
      this.handleMatch(card1, card2)
    } else {
      this.handleMismatch(card1, card2)
    }

    this.flippedCards = []
  }

  handleMatch(card1, card2) {
    // Mark cards as matched and make them disappear
    card1.element.classList.add("matched")
    card2.element.classList.add("matched")

    this.matchedPairs++
    this.updateStats()
    this.playSound("match")

    // Create enhanced celebration effect
    this.createMatchCelebration(card1.element)
    this.createMatchCelebration(card2.element)

    // Update reveal overlay
    this.updateRevealOverlay()

    if (this.matchedPairs === this.totalPairs) {
      setTimeout(() => this.handleGameComplete(), 2000) // Longer delay for dramatic reveal
    }
  }

  handleMismatch(card1, card2) {
    // Add enhanced mismatch animation
    card1.element.classList.add("mismatch")
    card2.element.classList.add("mismatch")

    setTimeout(() => {
      card1.element.classList.remove("flipped", "mismatch")
      card2.element.classList.remove("flipped", "mismatch")
    }, 600) // Match CSS animation duration
  }

  createMatchCelebration(cardElement) {
    const celebration = document.createElement("div")
    celebration.innerHTML = "✨"
    celebration.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      pointer-events: none;
      animation: celebrationPop 1.5s ease-out forwards;
      z-index: 15;
      filter: drop-shadow(0 0 15px rgba(255,255,0,0.5)); /* Gold glow */
    `

    cardElement.appendChild(celebration)

    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration)
      }
    }, 1500)
  }

  updateRevealOverlay() {
    const overlay = document.getElementById("revealOverlay")
    const progress = this.matchedPairs / this.totalPairs
    overlay.style.opacity = (progress * 0.25).toString() // More subtle reveal
  }

  handleGameComplete() {
    this.isGameActive = false
    const gameTime = this.formatTime(Date.now() - this.gameStartTime)
    const rating = this.calculateRating()

    document.getElementById("finalMoves").textContent = this.moves
    document.getElementById("finalTime").textContent = gameTime
    document.getElementById("finalRating").textContent = rating

    // Set the discovered picture
    const discoveredImage = document.getElementById("discoveredImage")
    discoveredImage.src = this.currentPicture.image
    discoveredImage.alt = this.currentPicture.name

    document.getElementById("pictureTitle").textContent = this.currentPicture.name
    document.getElementById("pictureDescription").textContent = this.currentPicture.description

    this.showScreen("victoryScreen") // Show victory screen
    this.stopBackgroundMusic()
    this.playVictoryMusic()
    this.createVictoryCelebration()
  }

  calculateRating() {
    const perfectMoves = this.totalPairs * 2
    const ratingBuffer = this.difficultyLevels[this.currentDifficulty].ratingBuffer

    if (this.moves <= perfectMoves + ratingBuffer) return "⭐⭐⭐"
    if (this.moves <= perfectMoves + ratingBuffer * 2) return "⭐⭐"
    return "⭐"
  }

  createVictoryCelebration() {
    const celebrationContainer = document.querySelector(".celebration-particles")
    const particles = ["✨", "💫", "🌟", "🔮", "🌌", "🏆", "🎉"] // Dark theme particles

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement("div")
      particle.textContent = particles[Math.floor(Math.random() * particles.length)]
      particle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 25 + 15}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: victoryParticle ${Math.random() * 4 + 3}s ease-out forwards;
        pointer-events: none;
        z-index: 20;
        filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
      `
      celebrationContainer.appendChild(particle)
    }

    setTimeout(() => {
      celebrationContainer.innerHTML = ""
    }, 7000)
  }

  startGameTimer() {
    this.gameTimer = setInterval(() => {
      if (this.isGameActive) {
        const elapsed = Date.now() - this.gameStartTime
        document.getElementById("timeCount").textContent = this.formatTime(elapsed)
      }
    }, 1000)
  }

  updateStats() {
    document.getElementById("moveCount").textContent = this.moves
    document.getElementById("matchCount").textContent = this.matchedPairs
    const revealedPercentage = Math.round((this.matchedPairs / this.totalPairs) * 100)
    document.getElementById("revealedCount").textContent = revealedPercentage + "%"

    // Animate stat updates
    this.animateStatUpdate("moveCount")
    this.animateStatUpdate("matchCount")
    this.animateStatUpdate("revealedCount")
  }

  animateStatUpdate(statId) {
    const element = document.getElementById(statId)
    element.style.transform = "scale(1.15)"
    element.style.color = "#e066ff" // Brighter purple for update

    setTimeout(() => {
      element.style.transform = "scale(1)"
      element.style.color = "#a020f0" // Back to original purple
    }, 300)
  }

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  shareScore() {
    const gameTime = this.formatTime(Date.now() - this.gameStartTime)
    const rating = this.calculateRating()
    const shareText = `🌌 I just unveiled "${this.currentPicture.name}" in MemoryScape on ${this.currentDifficulty} mode! 
🎯 ${this.moves} moves | ⏱️ ${gameTime} | ${rating}
Can you discover the mystery too? ✨

Play at: ${window.location.href}`

    if (navigator.share) {
      navigator.share({
        title: "MemoryScape - Dark Mystery Game",
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showNotification("Score copied to clipboard! 📋")
      })
    }
  }

  showNotification(message) {
    const notification = document.createElement("div")
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #6a0dad, #8a2be2); /* Dark purple notification */
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 25px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.9rem;
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 600)
    }, 3500)
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    const soundBtn = document.getElementById("soundToggle")
    const icon = soundBtn.querySelector(".btn-icon")
    icon.textContent = this.soundEnabled ? "🔊" : "🔇"
    soundBtn.classList.toggle("muted", !this.soundEnabled)
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled
    const musicBtn = document.getElementById("musicToggle")
    const icon = musicBtn.querySelector(".btn-icon")
    icon.textContent = this.musicEnabled ? "🎵" : "🔇"
    musicBtn.classList.toggle("muted", !this.musicEnabled)

    if (this.musicEnabled) {
      this.startBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
      this.stopVictoryMusic()
    }
  }

  playSound(type) {
    if (!this.soundEnabled) return

    const audio = document.getElementById(`${type}Sound`)
    if (audio) {
      audio.currentTime = 0
      audio.volume = 0.6 // Adjusted volume for dark theme
      audio.play().catch((e) => console.log("Audio play failed:", e))
    }
  }

  startBackgroundMusic() {
    if (!this.musicEnabled) return

    const audio = document.getElementById("backgroundMusic")
    if (audio) {
      audio.volume = 0.2 // Subtle background music
      audio.play().catch((e) => console.log("Background music play failed:", e))
    }
  }

  stopBackgroundMusic() {
    const audio = document.getElementById("backgroundMusic")
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  playVictoryMusic() {
    if (!this.musicEnabled) return

    const audio = document.getElementById("victoryMusic")
    if (audio) {
      audio.volume = 0.35 // Victory music volume
      audio.play().catch((e) => console.log("Victory music play failed:", e))
    }
  }

  stopVictoryMusic() {
    const audio = document.getElementById("victoryMusic")
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  addCustomAnimations() {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes clickEffect {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      }
      
      @keyframes celebrationPop {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.8) rotate(180deg); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0) rotate(360deg); opacity: 0; }
      }
      
      @keyframes victoryParticle {
        0% { 
          transform: translateY(0) rotate(0deg) scale(0.5); 
          opacity: 1; 
        }
        25% { 
          transform: translateY(-60px) rotate(90deg) scale(1); 
          opacity: 1; 
        }
        50% { 
          transform: translateY(-120px) rotate(180deg) scale(1.2); 
          opacity: 0.8; 
        }
        75% { 
          transform: translateY(-180px) rotate(270deg) scale(1); 
          opacity: 0.6; 
        }
        100% { 
          transform: translateY(-240px) rotate(360deg) scale(0.3); 
          opacity: 0; 
        }
      }
      
      @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOutRight {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MemoryScapeGame()
})
