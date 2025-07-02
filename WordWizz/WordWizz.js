class WordWizz {
  constructor() {
    // Game state
    this.targetWord = ""
    this.currentRow = 0
    this.currentCol = 0
    this.gameOver = false
    this.gameWon = false
    this.guesses = []
    this.currentGuess = ""
    this.currentCategory = "random"
    this.wordLength = 5
    this.maxAttempts = 5

    // Word lists based on your Java implementations
    this.wordLists = {
      fruits: [
        "APPLE",
        "BANANA",
        "MANGO",
        "PEAR",
        "GRAPE",
        "GUAVA",
        "PEACH",
        "PLUM",
        "PAPAYA",
        "LYCHEE",
        "ORANGE",
        "LEMON",
        "FIG",
        "DATES",
        "KIWI",
        "BERRY",
        "CHERRY",
        "MELON",
        "COCONUT",
        "AVOCADO",
        "SAPOTA",
        "TAMARIND",
      ],
      vegetables: [
        "PEA",
        "YAM",
        "OKRA",
        "KALE",
        "BEAN",
        "CORN",
        "BEET",
        "TARO",
        "LEEK",
        "CHARD",
        "ONION",
        "CARROT",
        "RADISH",
        "GARLIC",
        "POTATO",
        "TOMATO",
        "PEPPER",
        "SPINACH",
        "CELERY",
        "CABBAGE",
        "SQUASH",
        "TURNIP",
        "GINGER",
        "CHILI",
        "BEETROOT",
        "PUMPKIN",
        "LETTUCE",
        "FENNEL",
        "BRINJAL",
        "BITTER",
        "DRUMSTICK",
        "CUCUMBER",
        "CAULIFLOWER",
        "BROCCOLI",
      ],
      animals: [
        "LION",
        "TIGER",
        "ELEPHANT",
        "DEER",
        "MONKEY",
        "BEAR",
        "LEOPARD",
        "WOLF",
        "FOX",
        "RABBIT",
        "HORSE",
        "COW",
        "BUFFALO",
        "GOAT",
        "SHEEP",
        "CAMEL",
        "DOG",
        "CAT",
        "RAT",
        "PANDA",
        "BAT",
        "OTTER",
        "PIG",
        "OX",
        "DONKEY",
        "HARE",
        "ZEBRA",
        "CHEETAH",
        "PEACOCK",
        "EAGLE",
        "PARROT",
        "PIGEON",
        "SPARROW",
      ],
    }

    // Fallback words for random category
    this.fallbackWords = [
      "APPLE",
      "BREAD",
      "CRISP",
      "DREAM",
      "EARTH",
      "FROST",
      "GRAPE",
      "HOUSE",
      "INPUT",
      "JOKER",
      "KNIFE",
      "LIGHT",
      "MOUSE",
      "NURSE",
      "OLIVE",
      "PIZZA",
      "QUIET",
      "ROBIN",
      "STONE",
      "TIGER",
      "UNITE",
      "VIOLET",
      "WATER",
      "XENON",
      "YEAST",
      "ZEBRA",
      "ACTOR",
      "BIRCH",
      "CANDY",
      "DRILL",
      "ELITE",
      "FLAME",
    ]

    this.scoring = new ScoringSystem()
    this.soundManager = new SoundManager()
    this.init()
  }

  init() {
    this.createParticles()
    this.setupEventListeners()
    this.updateStatsDisplay()
    this.showCategoryScreen()

    // Handle orientation changes
    window.addEventListener("orientationchange", () => {
      this.handleOrientationChange()
    })

    // Handle window resize
    window.addEventListener("resize", () => {
      this.handleOrientationChange()
    })
  }

  createParticles() {
    const particlesContainer = document.getElementById("particles")
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 6 + "s"
      particle.style.animationDuration = Math.random() * 3 + 3 + "s"
      particlesContainer.appendChild(particle)
    }
  }

  setupEventListeners() {
    // Instructions button
    document.getElementById("instructionBtn").addEventListener("click", () => {
      this.showInstructions()
    })

    document.getElementById("closeInstructionsBtn").addEventListener("click", () => {
      this.hideInstructions()
    })

    // Category selection
    document.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.getAttribute("data-category")
        this.selectCategory(category)
      })
    })

    // Navigation buttons
    document.getElementById("backBtn").addEventListener("click", () => {
      this.showCategoryScreen()
    })

    document.getElementById("statsBtn").addEventListener("click", () => {
      this.showDetailedStats()
    })

    // Physical keyboard
    document.addEventListener("keydown", (e) => {
      if (this.gameOver) return

      const key = e.key.toUpperCase()

      if (key === "ENTER") {
        this.processEnter()
      } else if (key === "BACKSPACE") {
        this.processBackspace()
      } else if (key.match(/[A-Z]/) && key.length === 1) {
        this.processLetterInput(key)
      }
    })

    // On-screen keyboard
    document.querySelectorAll(".key").forEach((key) => {
      key.addEventListener("click", () => {
        if (this.gameOver) return

        const keyValue = key.getAttribute("data-key")

        if (keyValue === "ENTER") {
          this.processEnter()
        } else if (keyValue === "BACKSPACE") {
          this.processBackspace()
        } else {
          this.processLetterInput(keyValue)
        }
      })
    })

    // Modal buttons
    // Event listeners for playAgainBtn and mainMenuBtn are now set directly in showGameOverModal
    // to ensure they are always active after the modal is shown.
    document.getElementById("closeStatsBtn").addEventListener("click", () => {
      this.hideStatsModal()
    })

    document.getElementById("resetStatsBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all statistics? This cannot be undone.")) {
        this.scoring.resetStats()
        this.updateStatsDisplay()
        this.hideStatsModal()
        this.showMessage("Statistics reset successfully!")
      }
    })

    // Orientation change listener
    window.addEventListener("orientationchange", () => this.handleOrientationChange())
  }

  showInstructions() {
    document.getElementById("instructionsModal").classList.add("show")
  }

  hideInstructions() {
    document.getElementById("instructionsModal").classList.remove("show")
  }

  showCategoryScreen() {
    document.getElementById("categoryScreen").classList.remove("hidden")
    document.getElementById("gameScreen").classList.add("hidden")
    this.updateStatsDisplay()
    this.updateCategoryStats()
  }

  hideCategoryScreen() {
    document.getElementById("categoryScreen").classList.add("hidden")
    document.getElementById("gameScreen").classList.remove("hidden")
  }

  updateCategoryStats() {
    const stats = this.scoring.getStats()
    ;["random", "fruits", "vegetables", "animals"].forEach((category) => {
      const categoryStats = stats.categoryStats[category] || { played: 0, won: 0 }
      const element = document.getElementById(`${category}Stats`)
      if (element) {
        element.innerHTML = `
                    <span class="wins">${categoryStats.won} wins</span> • 
                    <span class="played">${categoryStats.played} played</span>
                `
      }
    })
  }

  async selectCategory(category) {
    this.currentCategory = category

    // Update UI
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
    document.getElementById("categoryName").textContent = categoryName

    this.hideCategoryScreen()
    await this.startNewGame()
  }

  async startNewGame() {
    try {
      if (this.currentCategory === "random") {
        this.targetWord = await this.fetchRandomWord()
        this.wordLength = 5 // API returns 5-letter words
      } else {
        const words = this.wordLists[this.currentCategory]
        this.targetWord = words[Math.floor(Math.random() * words.length)]
        this.wordLength = this.targetWord.length
      }

      this.maxAttempts = 5 // Like your Java implementation

      // Update word info
      document.getElementById("wordInfo").textContent = `${this.wordLength} letters`

      this.createGrid()
      this.resetGameState()

      // console.log("Target word:", this.targetWord) // For debugging
    } catch (error) {
      console.error("Failed to start new game:", error)
      this.showMessage("Failed to load word. Please try again.")
    }
  }

  async fetchRandomWord() {
    try {
      const response = await fetch("https://random-word-api.herokuapp.com/word?number=1&length=5")
      if (response.ok) {
        const data = await response.json()
        return data[0].toUpperCase()
      } else {
        throw new Error("API request failed")
      }
    } catch (error) {
      console.error("API Error:", error)
      // Fallback to predefined words
      return this.fallbackWords[Math.floor(Math.random() * this.fallbackWords.length)]
    }
  }

  createGrid() {
    const gameGrid = document.getElementById("gameGrid")
    gameGrid.innerHTML = ""

    // Set grid template
    gameGrid.style.gridTemplateRows = `repeat(${this.maxAttempts}, 1fr)`

    for (let row = 0; row < this.maxAttempts; row++) {
      const rowElement = document.createElement("div")
      rowElement.classList.add("grid-row")
      rowElement.style.gridTemplateColumns = `repeat(${this.wordLength}, 1fr)`

      for (let col = 0; col < this.wordLength; col++) {
        const tile = document.createElement("div")
        tile.classList.add("tile")

        // Adjust tile size based on word length (like your Java implementation)
        if (this.wordLength > 7) {
          tile.classList.add("small")
        } else if (this.wordLength < 5) {
          tile.classList.add("large")
        }

        tile.setAttribute("data-row", row)
        tile.setAttribute("data-col", col)
        rowElement.appendChild(tile)
      }

      gameGrid.appendChild(rowElement)
    }
  }

  resetGameState() {
    this.gameOver = false
    this.gameWon = false
    this.currentRow = 0
    this.currentCol = 0
    this.guesses = []
    this.currentGuess = ""

    // Reset keyboard colors
    document.querySelectorAll(".key").forEach((key) => {
      key.classList.remove("correct", "present", "absent")
    })
  }

  processLetterInput(letter) {
    if (this.currentRow < this.maxAttempts && this.currentCol < this.wordLength) {
      const tile = document.querySelector(`[data-row="${this.currentRow}"][data-col="${this.currentCol}"]`)
      tile.textContent = letter
      tile.classList.add("filled")

      this.currentGuess += letter
      this.currentCol++

      // Play key press sound
      this.soundManager.playKeyPress()

      // Auto-submit when row is filled (like your Java implementation)
      if (this.currentCol === this.wordLength) {
        setTimeout(() => this.processEnter(), 300)
      }
    }
  }

  processBackspace() {
    if (this.currentCol > 0) {
      this.currentCol--
      const tile = document.querySelector(`[data-row="${this.currentRow}"][data-col="${this.currentCol}"]`)
      tile.textContent = ""
      tile.classList.remove("filled")

      this.currentGuess = this.currentGuess.slice(0, -1)
      this.soundManager.playKeyPress()
    }
  }

  async processEnter() {
    if (this.currentCol === this.wordLength) {
      await this.checkGuess()

      this.guesses.push(this.currentGuess)

      if (this.currentGuess === this.targetWord) {
        this.gameWon = true
        this.gameOver = true
        this.soundManager.playWin()
        this.createCelebrationAnimation()
        setTimeout(() => this.showGameOverModal(), 2000)
      } else if (this.currentRow === this.maxAttempts - 1) {
        this.gameOver = true
        this.soundManager.playLoss()
        setTimeout(() => this.showGameOverModal(), 1500)
      } else {
        this.currentRow++
        this.currentCol = 0
        this.currentGuess = ""
      }
    }
  }

  createCelebrationAnimation() {
    const celebrationContainer = document.getElementById("celebrationAnimation")
    celebrationContainer.innerHTML = "" // Clear previous confetti

    // Create confetti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = Math.random() * 100 + "%"
      confetti.style.backgroundColor = this.getRandomColor()
      confetti.style.animationDelay = Math.random() * 3 + "s"
      celebrationContainer.appendChild(confetti)

      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti)
        }
      }, 3000)
    }
  }

  getRandomColor() {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  async checkGuess() {
    const guess = this.currentGuess
    const target = this.targetWord

    // First pass: mark correct positions (green)
    const correctPositions = new Array(this.wordLength).fill(false)
    const targetChars = [...target]

    for (let i = 0; i < this.wordLength; i++) {
      if (guess[i] === target[i]) {
        correctPositions[i] = true
        targetChars[i] = null // Mark as used
      }
    }

    // Second pass: mark wrong positions (yellow) and absent (gray)
    const result = []
    for (let i = 0; i < this.wordLength; i++) {
      if (correctPositions[i]) {
        result[i] = "correct"
      } else {
        const charIndex = targetChars.indexOf(guess[i])
        if (charIndex !== -1) {
          result[i] = "present"
          targetChars[charIndex] = null // Mark as used
        } else {
          result[i] = "absent"
        }
      }
    }

    // Animate tiles with results
    for (let i = 0; i < this.wordLength; i++) {
      const tile = document.querySelector(`[data-row="${this.currentRow}"][data-col="${i}"]`)
      const letter = guess[i]

      setTimeout(() => {
        tile.classList.add("flip")
        setTimeout(() => {
          tile.classList.add(result[i])
          this.updateKeyboard(letter, result[i])

          // Play sound based on result
          if (result[i] === "correct") {
            this.soundManager.playCorrect()
          } else if (result[i] === "present") {
            this.soundManager.playPresent()
          } else {
            this.soundManager.playAbsent()
          }
        }, 300)
      }, i * 100)
    }

    // Wait for animations to complete
    await new Promise((resolve) => setTimeout(resolve, 800))
  }

  updateKeyboard(letter, result) {
    const key = document.querySelector(`[data-key="${letter}"]`)
    if (!key) return

    // Don't downgrade key color (correct > present > absent)
    if (key.classList.contains("correct")) return
    if (key.classList.contains("present") && result === "absent") return

    key.classList.remove("correct", "present", "absent")
    key.classList.add(result)
  }

  showGameOverModal() {
    const gameResult = this.scoring.recordGame(
      this.gameWon,
      this.currentRow + 1,
      this.wordLength,
      this.currentCategory,
      this.targetWord,
    )

    const modal = document.getElementById("modalOverlay")
    const title = document.getElementById("modalTitle")
    const correctWordSpan = document.getElementById("correctWord")
    const gameResultIcon = document.getElementById("gameResultIcon")

    // Get overall stats for the simplified scorecard
    const overallStats = this.scoring.getStats()
    document.getElementById("gameOverTotalPlayed").textContent = overallStats.totalGames
    document.getElementById("gameOverTotalWins").textContent = overallStats.totalWins
    document.getElementById("gameOverCurrentStreak").textContent = overallStats.currentStreak

    if (this.gameWon) {
      title.textContent = "🎉 Congratulations!"
      gameResultIcon.textContent = "🎉"
      modal.querySelector(".modal").classList.add("win-celebration")
    } else {
      title.textContent = "😔 Game Over"
      gameResultIcon.textContent = "😔"
      modal.querySelector(".modal").classList.add("loss-animation")
    }

    // Always show the target word
    correctWordSpan.textContent = this.targetWord

    // Ensure modal buttons are properly set up with fresh event listeners
    const playAgainBtn = document.getElementById("playAgainBtn")
    const mainMenuBtn = document.getElementById("mainMenuBtn")

    // Remove any existing event listeners
    playAgainBtn.replaceWith(playAgainBtn.cloneNode(true))
    mainMenuBtn.replaceWith(mainMenuBtn.cloneNode(true))

    // Get fresh references after cloning
    const newPlayAgainBtn = document.getElementById("playAgainBtn")
    const newMainMenuBtn = document.getElementById("mainMenuBtn")

    // Add fresh event listeners
    newPlayAgainBtn.addEventListener("click", () => {
      this.hideModal()
      this.startNewGame()
    })

    newMainMenuBtn.addEventListener("click", () => {
      this.hideModal()
      this.showCategoryScreen()
    })

    modal.classList.add("show")
    this.updateStatsDisplay()
    this.updateCategoryStats()

    // Ensure modal is scrolled to top
    setTimeout(() => {
      const modalContent = modal.querySelector(".modal")
      if (modalContent) {
        modalContent.scrollTop = 0
      }
    }, 100)
  }

  hideModal() {
    const modalOverlay = document.getElementById("modalOverlay")
    const modalContent = modalOverlay.querySelector(".modal")

    // Remove animation classes from the modal content
    modalContent.classList.remove("win-celebration", "loss-animation")

    // Clear any dynamic confetti
    const celebrationContainer = document.getElementById("celebrationAnimation")
    if (celebrationContainer) {
      celebrationContainer.innerHTML = ""
    }

    // Hide the modal overlay
    modalOverlay.classList.remove("show")
  }

  showDetailedStats() {
    const stats = this.scoring.getStats()
    const modal = document.getElementById("statsModal")
    const detailedStats = document.getElementById("detailedStats")

    let statsHTML = `
            <div class="overall-stats">
                <h3>Overall Performance</h3>
                <p><strong>Games Played:</strong> ${stats.totalGames}</p>
                <p><strong>Games Won:</strong> ${stats.totalWins}</p>
                <p><strong>Win Rate:</strong> ${stats.winPercentage}%</p>
                <p><strong>Current Streak:</strong> ${stats.currentStreak}</p>
                <p><strong>Best Streak:</strong> ${stats.bestStreak}</p>
                <p><strong>Average Guesses:</strong> ${stats.averageGuesses}</p>
            </div>
        `

    if (Object.keys(stats.categoryStats).length > 0) {
      statsHTML += '<div class="category-stats"><h3>Category Performance</h3>'

      Object.entries(stats.categoryStats).forEach(([category, catStats]) => {
        const winRate = catStats.played > 0 ? Math.round((catStats.won / catStats.played) * 100) : 0
        const avgScore = catStats.won > 0 ? Math.round(catStats.totalScore / catStats.won) : 0

        statsHTML += `
                    <div class="category-stat">
                        <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                        <p><strong>Played:</strong> ${catStats.played} | <strong>Won:</strong> ${catStats.won} | <strong>Win Rate:</strong> ${winRate}%</p>
                        <p><strong>Best Score:</strong> ${catStats.bestScore} | <strong>Average Score:</strong> ${avgScore}</p>
                    </div>
                `
      })

      statsHTML += "</div>"
    }

    detailedStats.innerHTML = statsHTML
    modal.classList.add("show")
  }

  hideStatsModal() {
    document.getElementById("statsModal").classList.remove("show")
  }

  updateStatsDisplay() {
    const stats = this.scoring.getStats()

    document.getElementById("totalGames").textContent = stats.totalGames
    document.getElementById("winPercentage").textContent = stats.winPercentage
    document.getElementById("currentStreak").textContent = stats.currentStreak
    document.getElementById("bestStreak").textContent = stats.bestStreak
  }

  // Enhanced showMessage method for better mobile visibility
  showMessage(message) {
    const messageEl = document.createElement("div")
    messageEl.className = "message-toast"
    messageEl.textContent = message

    // Position based on screen size
    if (window.innerWidth <= 768) {
      messageEl.style.top = "15px"
      messageEl.style.fontSize = "1rem"
      messageEl.style.padding = "15px 20px"
      messageEl.style.maxWidth = "90%"
      messageEl.style.textAlign = "center"
    }

    document.body.appendChild(messageEl)
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove()
      }
    }, 4000)
  }

  // Add method to handle orientation changes
  handleOrientationChange() {
    // Recalculate grid layout after orientation change
    setTimeout(() => {
      if (!document.getElementById("gameScreen").classList.contains("hidden")) {
        this.createGrid()
      }
    }, 100)
  }
}

// Enhanced Scoring System Class
class ScoringSystem {
  constructor() {
    this.storageKey = "wordwizz_stats"
    this.loadStats()
  }

  loadStats() {
    const saved = localStorage.getItem(this.storageKey)
    this.stats = saved
      ? JSON.parse(saved)
      : {
          totalGames: 0,
          totalWins: 0,
          currentStreak: 0,
          bestStreak: 0,
          winPercentage: 0,
          averageGuesses: 0,
          categoryStats: {},
          lastPlayed: null,
        }
  }

  saveStats() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.stats))
  }

  calculateScore(attempts, wordLength, category) {
    const baseScore = 100
    const attemptBonus = Math.max(0, (6 - attempts) * 20)
    const lengthBonus = (wordLength - 3) * 10

    const categoryMultipliers = {
      random: 1.0,
      fruits: 1.1,
      vegetables: 1.2,
      animals: 1.3,
    }

    const multiplier = categoryMultipliers[category] || 1.0
    return Math.round((baseScore + attemptBonus + lengthBonus) * multiplier)
  }

  recordGame(won, attempts, wordLength, category, word) {
    const score = won ? this.calculateScore(attempts, wordLength, category) : 0

    // Update overall stats
    this.stats.totalGames++

    if (won) {
      this.stats.totalWins++
      this.stats.currentStreak++
      this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak)

      // Update average guesses
      const totalGuesses = this.stats.averageGuesses * (this.stats.totalWins - 1) + attempts
      this.stats.averageGuesses = Math.round((totalGuesses / this.stats.totalWins) * 10) / 10
    } else {
      this.stats.currentStreak = 0
    }

    this.stats.winPercentage = Math.round((this.stats.totalWins / this.stats.totalGames) * 100)

    // Update category stats
    if (!this.stats.categoryStats[category]) {
      this.stats.categoryStats[category] = {
        played: 0,
        won: 0,
        totalScore: 0,
        bestScore: 0,
      }
    }

    const catStats = this.stats.categoryStats[category]
    catStats.played++

    if (won) {
      catStats.won++
      catStats.totalScore += score
      catStats.bestScore = Math.max(catStats.bestScore, score)
    }

    this.stats.lastPlayed = new Date().toISOString()
    this.saveStats()

    return { score }
  }

  getStats() {
    return this.stats
  }

  resetStats() {
    this.stats = {
      totalGames: 0,
      totalWins: 0,
      currentStreak: 0,
      bestStreak: 0,
      winPercentage: 0,
      averageGuesses: 0,
      categoryStats: {},
      lastPlayed: null,
    }
    this.saveStats()
  }
}

// Sound Manager Class for Open Source Sound Effects
class SoundManager {
  constructor() {
    this.audioContext = null
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn("Web Audio API not supported")
    }
  }

  createTone(frequency, duration, type = "sine") {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playKeyPress() {
    this.createTone(800, 0.1, "square")
  }

  playCorrect() {
    this.createTone(523.25, 0.2) // C5
    setTimeout(() => this.createTone(659.25, 0.2), 100) // E5
    setTimeout(() => this.createTone(783.99, 0.3), 200) // G5
  }

  playPresent() {
    this.createTone(440, 0.15) // A4
    setTimeout(() => this.createTone(554.37, 0.15), 75) // C#5
  }

  playAbsent() {
    this.createTone(220, 0.2, "sawtooth")
  }

  playWin() {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => this.createTone(note, 0.4), index * 150)
    })
  }

  playLoss() {
    // Sad trombone effect
    this.createTone(440, 0.5, "sawtooth")
    setTimeout(() => this.createTone(415.3, 0.5, "sawtooth"), 250)
    setTimeout(() => this.createTone(392, 0.8, "sawtooth"), 500)
  }
}

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  new WordWizz()
})
