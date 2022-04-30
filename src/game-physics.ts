export class GamePhysics {
  private lastTimeFall: number = 0
  private delayFall: number = 500
  constructor (private readonly gameLimits: { bottom: number, left: number, right: number }) { }

  public checkColisions (fixedSquarePositions: { x: number, y: number }[], nextNotFixedPosition: { x: number, y: number }[]): boolean {
    const isColision = nextNotFixedPosition.some(({ x, y }) => {
      const isInLimits = y >= this.gameLimits.bottom || x >= this.gameLimits.right || x <= this.gameLimits.left
      const isInFixedSquare = fixedSquarePositions.some(({ x: fixedSquareX, y: fixedSquareY }) => x === fixedSquareX && y === fixedSquareY)
      return isInLimits ? true : isInFixedSquare
    })
    return isColision
  }

  public fallTime (speed: number, fallMethod: () => void): void {
    if (this.lastTimeFall === 0) this.lastTimeFall = Date.now()
    if (this.lastTimeFall >= Date.now() - (this.delayFall - speed * 100)) return

    fallMethod()

    this.lastTimeFall = 0
  }
}
