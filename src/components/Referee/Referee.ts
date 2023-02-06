import {
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../../Constants";

export default class Referee {
  static tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    return !!boardState.find((p) => samePosition(p.position, position));
  }

  static tileIsOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return !!boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team
    );
  }

  static isEnPassant(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        return !!boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
      }
    }
    return false;
  }

  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;
      // MOVEMENT LOGIC
      if (
        initialPosition.x === desiredPosition.x &&
        initialPosition.y === specialRow &&
        desiredPosition.y - initialPosition.y === 2 * pawnDirection
      ) {
        return (
          !Referee.tileIsOccupied(desiredPosition, boardState) &&
          !Referee.tileIsOccupied(
            { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
            boardState
          )
        );
      }
      if (
        initialPosition.x === desiredPosition.x &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        return !Referee.tileIsOccupied(desiredPosition, boardState);
      }
      // ATTACK LOGIC
      if (
        desiredPosition.x - initialPosition.x === -1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        return Referee.tileIsOccupiedByOpponent(
          desiredPosition,
          boardState,
          team
        );
      }
      if (
        desiredPosition.x - initialPosition.x === 1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        return Referee.tileIsOccupiedByOpponent(
          desiredPosition,
          boardState,
          team
        );
      }
    } else if (type === PieceType.KNIGHT) {
      // MOVEMENT OF THE KNIGHT
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          // TOP AND BOTTOM SIDE MOVEMENT
          if (desiredPosition.y - initialPosition.y === 2 * i) {
            if (desiredPosition.x - initialPosition.x === j) {
              if (
                !this.tileIsOccupied(desiredPosition, boardState) ||
                this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
              ) {
                return true;
              }
            }
          }
          // LEFT AND RIGHT SIDE MOVEMENT
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === j) {
              if (
                !this.tileIsOccupied(desiredPosition, boardState) ||
                this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
}
