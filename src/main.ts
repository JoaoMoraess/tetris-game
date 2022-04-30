import { GameController } from './game-controller'
import { GameGraphycs } from './game-graphcs'
import { GameKeyboard } from './game-keyboard'
import { GamePhysics } from './game-physics'
import { SHAPES } from './game-shapes'
import './style.css'

const gameCanvas = document.querySelector<HTMLCanvasElement>('#game')!

const configCanvas = (canvas: HTMLCanvasElement) => {
  const squareWidth = 32
  const squarePadding = 5

  canvas.width = (squareWidth * 15) + (squarePadding * 14)
  canvas.height = (squareWidth * 30) + (squarePadding * 29)
  canvas.style.background = '#777'
}

configCanvas(gameCanvas)

const gameGraphycs = new GameGraphycs(gameCanvas.getContext('2d')!)

const gameKeyboard = new GameKeyboard()
const gamePhysics = new GamePhysics({ bottom: 30, left: -1, right: 15 })
const gameController = new GameController(gameGraphycs, gamePhysics, gameKeyboard, SHAPES)
gameController.generateRandomShape()

const handleKeyEvent = (event: KeyboardEvent) => {
  if (!gameController.isGameRuning) return

  const action = event.type as 'keydown' | 'keyup'
  gameKeyboard[action](event)
}

window.addEventListener('keydown', (e) => handleKeyEvent(e))
window.addEventListener('keyup', (e) => handleKeyEvent(e))

const startGameRunButton = document.getElementById('start-game-button') as HTMLButtonElement
const pauseGameRunButton = document.getElementById('pause-game-button') as HTMLButtonElement

startGameRunButton.onclick = () => gameController.start()
pauseGameRunButton.onclick = () => gameController.stop()
