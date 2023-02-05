import { Piece, PieceType, TeamType } from "../../Constants";

export default class Referee {
  static tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return !!boardState.find((p) => p.position.x === x && p.position.y === y);
  }

  static TileIsOccupiedByOpponent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return !!boardState.find(
      (p) => p.position.x === x && p.position.y === y && p.team !== team
    );
  }

  static isEnPassant(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if ((x - px === -1 || x - px === 1) && y - py === pawnDirection) {
        return !!boardState.find(
          (p) =>
            p.position.x === x &&
            p.position.y === y - pawnDirection &&
            p.enPassant
        );
      }
    }
    return false;
  }

  static isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;
      // MOVEMENT LOGIC
      if (px === x && py === specialRow && y - py === 2 * pawnDirection) {
        if (
          !Referee.tileIsOccupied(x, y, boardState) &&
          !Referee.tileIsOccupied(x, y - pawnDirection, boardState)
        ) {
          return true;
        }
      } else if (px === x && y - py === pawnDirection) {
        if (!Referee.tileIsOccupied(x, y, boardState)) {
          return true;
        }
      }
      // ATTACK LOGIC
      else if (x - px === -1 && y - py === pawnDirection) {
        if (Referee.TileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      } else if (x - px === 1 && y - py === pawnDirection) {
        if (Referee.TileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      }
    }
    return false;
  }
}
