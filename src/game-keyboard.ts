export class GameKeyboard {
  private readonly aceptedKeys = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'Space']
  public pressedKeys: { [key: string]: boolean } = { ArrowDown: false }
  public arrowAction: (direction: string) => void = () => { }
  public spaceAction: () => void = () => { }
  constructor () { }

  public keyup (event: KeyboardEvent) {
    this.pressedKeys[event.key] = false
  }

  keydown (event: KeyboardEvent): void {
    if (!this.aceptedKeys.includes(event.code)) return
    if (event.code.includes('Arrow')) {
      const action = event.code.replace('Arrow', '').toLowerCase()
      this.arrowAction(action)
    }
    if (event.code === 'Space') {
      this.spaceAction()
    }
    this.pressedKeys[event.code] = true
  }
}
