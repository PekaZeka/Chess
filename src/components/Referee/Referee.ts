/* eslint-disable no-console */
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

  static pawnMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
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
    return false;
  }

  static rookMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    if (initialPosition.x === desiredPosition.x) {
      for (let i = 1; i < 8; i += 1) {
        const multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;

        const passedPosition: Position = {
          x: initialPosition.x,
          y: initialPosition.y + i * multiplier,
        };
        if (
          passedPosition.x === desiredPosition.x &&
          passedPosition.y === desiredPosition.y
        ) {
          if (
            !this.tileIsOccupied(desiredPosition, boardState) ||
            this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          ) {
            return true;
          }
        }
        if (this.tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }

    if (initialPosition.y === desiredPosition.y) {
      for (let i = 1; i < 8; i += 1) {
        const multiplier = desiredPosition.x < initialPosition.x ? -1 : 1;

        const passedPosition: Position = {
          x: initialPosition.x + i * multiplier,
          y: initialPosition.y,
        };
        if (
          passedPosition.x === desiredPosition.x &&
          passedPosition.y === desiredPosition.y
        ) {
          if (
            !this.tileIsOccupied(desiredPosition, boardState) ||
            this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          ) {
            return true;
          }
        }
        if (this.tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    return false;
  }

  static knightMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    // MOVEMENT OF THE KNIGHT
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        // TOP AND BOTTOM SIDE MOVEMENT
        if (desiredPosition.y - initialPosition.y === 2 * i) {
          if (desiredPosition.x - initialPosition.x === j) {
            return (
              !this.tileIsOccupied(desiredPosition, boardState) ||
              this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
            );
          }
        }
        // LEFT AND RIGHT SIDE MOVEMENT
        if (desiredPosition.x - initialPosition.x === 2 * i) {
          if (desiredPosition.y - initialPosition.y === j) {
            return (
              !this.tileIsOccupied(desiredPosition, boardState) ||
              this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
            );
          }
        }
      }
    }
    return false;
  }

  static bishopMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    // MOVEMENT OF THE BISHOP
    for (let i = 1; i < 8; i += 1) {
      // UP RIGHT MOVEMENT
      if (
        desiredPosition.x > initialPosition.x &&
        desiredPosition.y > initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x + i,
          y: initialPosition.y + i,
        };
        // CHECK IF THE TILE IS THE DESTINATION TILE
        if (samePosition(passedPosition, desiredPosition)) {
          // DEALING WITH DESTINATION TILE
          if (
            !this.tileIsOccupied(desiredPosition, boardState) ||
            this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          ) {
            return true;
          }
        } else if (this.tileIsOccupied(passedPosition, boardState)) {
          // DEALING WITH PASSING THE TILE
          break;
        }
      }
      // UP LEFT MOVEMENT
      if (
        desiredPosition.x < initialPosition.x &&
        desiredPosition.y > initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x - i,
          y: initialPosition.y + i,
        };
        // CHECK IF THE TILE IS THE DESTINATION TILE
        if (samePosition(passedPosition, desiredPosition)) {
          // DEALING WITH DESTINATION TILE
          if (
            !this.tileIsOccupied(desiredPosition, boardState) ||
            this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          ) {
            return true;
          }
        } else if (this.tileIsOccupied(passedPosition, boardState)) {
          // DEALING WITH PASSING THE TILE
          break;
        }
      }
      // BOTTOM RIGHT MOVEMENT
      if (
        desiredPosition.x > initialPosition.x &&
        desiredPosition.y < initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x + i,
          y: initialPosition.y - i,
        };
        // CHECK IF THE TILE IS THE DESTINATION TILE
        if (samePosition(passedPosition, desiredPosition)) {
          // DEALING WITH DESTINATION TILE
          if (
            !this.tileIsOccupied(desiredPosition, boardState) ||
            this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          ) {
            return true;
          }
        } else if (this.tileIsOccupied(passedPosition, boardState)) {
          // DEALING WITH PASSING THE TILE
          break;
        }
      }
      // BOTTOM LEFT MOVEMENT
      if (
        desiredPosition.x < initialPosition.x &&
        desiredPosition.y < initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x - i,
          y: initialPosition.y - i,
        };
        // CHECK IF THE TILE IS THE DESTINATION TILE
        if (samePosition(passedPosition, desiredPosition)) {
          // DEALING WITH DESTINATION TILE
          if (
            !this.tileIsOccupied(desiredPosition, boardState) ||
            this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          ) {
            return true;
          }
        } else if (this.tileIsOccupied(passedPosition, boardState)) {
          // DEALING WITH PASSING THE TILE
          break;
        }
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
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = this.pawnMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.ROOK:
        validMove = this.rookMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KNIGHT:
        validMove = this.knightMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.BISHOP:
        validMove = this.bishopMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.QUEEN:
        console.log("Queen");
        break;
      case PieceType.KING:
        console.log("King");
        break;

      default:
        break;
    }

    return validMove;
  }
}
