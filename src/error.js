export class GameError extends Error {
  constructor(errors) {
    super(errors.join('; '));
    this.name = 'GameError';
    this.errors = errors;
  }
}
