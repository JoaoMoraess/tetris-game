export class GameGraphycs {
  private readonly SQUARE_PADDING = 5
  constructor (private context: CanvasRenderingContext2D) {}

  public clear () {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    )
  }

  public drawSquare (x: number, y: number, size: number, color: string) {
    this.context.fillStyle = color
    const step = size + this.SQUARE_PADDING
    this.context.fillRect(x * step, y * step, size, size)
  }
}
