import { GameGraphycs } from './game-graphcs'
import { GameKeyboard } from './game-keyboard'
import { GamePhysics } from './game-physics'

type Shape = {
  positions: { x: number, y: number, center?: boolean }[]
  color: string
}
type Square = {
  x: number
  y: number
  color: string
  fixed: boolean
  center?: boolean
}

export class GameController {
  private typesOfShapes: Shape[] = []

  public isGameRuning: boolean = false
  public pointerButton: HTMLButtonElement | null = null
  public points: number = 0
  private speed: number = 1
  private squares: Square[] = []

  private readonly squareWidth = 32
  private lastTimeAction: number = 0

  constructor (
    private readonly gameGraphycs: GameGraphycs,
    private readonly gamePhysics: GamePhysics,
    private readonly gameKeyboard: GameKeyboard,
    typesOfShapes: Shape[]
  ) {
    this.typesOfShapes = typesOfShapes
    this.pointerButton = document.getElementById('points') as HTMLButtonElement
  }

  public stop (): void {
    this.isGameRuning = false
  }

  public start (): void {
    if (this.isGameRuning) return
    this.gameKeyboard.arrowAction = this.moveSquares.bind(this)
    this.gameKeyboard.spaceAction = this.rotateShape.bind(this)
    this.isGameRuning = true
    this.gameLoop()
  }

  public setSpeed (speed: number): void {
    this.speed = speed
  }

  public loadSquares (): {x: number, y: number, color: string, fixed: boolean, }[] {
    return this.squares
  }

  public addSquare (x: number, y: number, color: string, fixed?: boolean, center?: boolean): void {
    this.squares.push({ x, y, color, fixed: fixed || false, center })
  }

  public rotateShape (): void {
    const centerSquarePosition = this.squares.find((square) => !square.fixed && !!square.center)
    if (!centerSquarePosition) return

    const nextSquarePosition = this.squares
      .filter((square) => !square.fixed)
      .map((square) => {
        const nextX = centerSquarePosition.x + (square.y - centerSquarePosition.y)
        const nextY = centerSquarePosition.y - (square.x - centerSquarePosition.x)
        return { x: nextX, y: nextY }
      })

    const fixedSquarePositions = this.squares
      .filter((square) => square.fixed)
      .map((square) => ({ x: square.x, y: square.y }))

    const hasColision = this.gamePhysics.checkColisions(fixedSquarePositions, nextSquarePosition)

    if (hasColision) return

    this.squares
      .filter((square) => !square.fixed)
      .forEach((square) => {
        const nextX = centerSquarePosition.x + (square.y - centerSquarePosition.y)
        const nextY = centerSquarePosition.y - (square.x - centerSquarePosition.x)
        square.x = nextX
        square.y = nextY
      })

    this.gameGraphycs.clear()
  }

  public generateRandomShape (): void {
    const randomShape = this.typesOfShapes[Math.floor(Math.random() * this.typesOfShapes.length)]

    randomShape.positions.forEach((position) => {
      const isInCenter = position.center ?? false
      this.addSquare(position.x, position.y, randomShape.color, false, isInCenter)
    })
  }

  public moveSquares (direction: string): void {
    const nextNotFixedPosition = this.squares
      .filter((item) => !item.fixed)
      .map((square) => {
        const nextX =
          square.x +
          (direction === 'right' ? 1 : direction === 'left' ? -1 : 0)
        const nextY = square.y + (direction === 'down' ? 1 : 0)
        return { x: nextX, y: nextY }
      })
    const fixedSquarePositions = this.squares
      .filter((square) => square.fixed)
      .map((square) => ({ x: square.x, y: square.y }))
    const isColision = this.gamePhysics.checkColisions(
      fixedSquarePositions,
      nextNotFixedPosition
    )

    if (isColision) {
      if (direction === 'down') {
        this.squares.forEach((square) => (square.fixed = true))
        this.generateRandomShape()
      }
      return
    }

    this.squares
      .filter((square) => !square.fixed)
      .forEach((square) => {
        switch (direction) {
          case 'left':
            square.x -= 1
            break
          case 'right':
            square.x += 1
            break
          case 'down':
            square.y += 1
            break
        }
      })
    this.gameGraphycs.clear()
  }

  private checkActions (): void {
    const actionDelay = 30
    if (this.lastTimeAction === 0) this.lastTimeAction = Date.now()
    if (this.lastTimeAction >= Date.now() - actionDelay) return

    if (this.gameKeyboard.pressedKeys.ArrowDown) {
      this.setSpeed(5)
    } else {
      this.setSpeed(1)
    }

    this.lastTimeAction = 0
  }

  private checkScore (): void {
    const fixedSquares = this.squares.filter((square) => square.fixed)
    const layersNumber = [...new Set(fixedSquares.map((item) => item.y))]
    const fullLayerYPositions: number[] = []
    layersNumber.forEach((layer) => {
      const isFullLayer =
        fixedSquares.filter((square) => square.y === layer).length >= 15
      if (isFullLayer) fullLayerYPositions.push(layer)
    })

    if (fullLayerYPositions.length > 0) {
      fullLayerYPositions.forEach((layer) => {
        this.squares = this.squares.filter((square) => square.y !== layer)
      })
      this.points += fullLayerYPositions.length * 10
      if (this.pointerButton) { this.pointerButton.innerText = this.points.toString() }
    }

    fullLayerYPositions.sort().forEach((layerYPosition) => {
      layersNumber
        .filter((layerNumber) => layerNumber < layerYPosition)
        .forEach((layerNumber) => {
          const onTopLayer = fixedSquares.filter((square) => square.y === layerNumber)
          onTopLayer.forEach((square) => { square.y += 1 })
        })
    })

    this.gameGraphycs.clear()
  }

  private gameLoop (): void {
    if (!this.isGameRuning) return

    this.gamePhysics.fallTime(this.speed, () => this.moveSquares('down'))
    this.checkScore()
    this.checkActions()

    this.squares.forEach((square) => {
      this.gameGraphycs.drawSquare(square.x, square.y, this.squareWidth, square.color)
    })

    requestAnimationFrame(() => this.gameLoop())
  }
}
