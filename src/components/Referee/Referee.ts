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
    for (let i = 1; i < 8; i += 1) {
      //  VERTICAL MOVEMENT
      if (initialPosition.x === desiredPosition.x) {
        const multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;

        const passedPosition: Position = {
          x: initialPosition.x,
          y: initialPosition.y + i * multiplier,
        };
        if (samePosition(passedPosition, desiredPosition)) {
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
      // HORIZONTAL MOVEMENT
      if (initialPosition.y === desiredPosition.y) {
        const multiplier = desiredPosition.x < initialPosition.x ? -1 : 1;

        const passedPosition: Position = {
          x: initialPosition.x + i * multiplier,
          y: initialPosition.y,
        };
        if (samePosition(passedPosition, desiredPosition)) {
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
    for (let i = 1; i < 8; i += 1) {
      // DIAGONAL MOVEMENT
      const multiplierX = desiredPosition.x < initialPosition.x ? -1 : 1;
      const multiplierY = desiredPosition.y < initialPosition.y ? -1 : 1;

      const passedPosition: Position = {
        x: initialPosition.x + i * multiplierX,
        y: initialPosition.y + i * multiplierY,
      };
      if (samePosition(passedPosition, desiredPosition)) {
        if (
          !this.tileIsOccupied(desiredPosition, boardState) ||
          this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
        ) {
          return true;
        }
      } else if (this.tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
    return false;
  }

  static queenMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    for (let i = 1; i < 8; i += 1) {
      let multiplierX;
      if (desiredPosition.x < initialPosition.x) {
        multiplierX = -1;
      } else if (desiredPosition.x > initialPosition.x) {
        multiplierX = 1;
      } else {
        multiplierX = 0;
      }
      let multiplierY;
      if (desiredPosition.y < initialPosition.y) {
        multiplierY = -1;
      } else if (desiredPosition.y > initialPosition.y) {
        multiplierY = 1;
      } else {
        multiplierY = 0;
      }
      const passedPosition: Position = {
        x: initialPosition.x + i * multiplierX,
        y: initialPosition.y + i * multiplierY,
      };
      if (samePosition(passedPosition, desiredPosition)) {
        if (
          !this.tileIsOccupied(desiredPosition, boardState) ||
          this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
        ) {
          return true;
        }
      } else if (this.tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
    return false;
  }

  static kingMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    let multiplierX;
    if (desiredPosition.x < initialPosition.x) {
      multiplierX = -1;
    } else if (desiredPosition.x > initialPosition.x) {
      multiplierX = 1;
    } else {
      multiplierX = 0;
    }
    let multiplierY;
    if (desiredPosition.y < initialPosition.y) {
      multiplierY = -1;
    } else if (desiredPosition.y > initialPosition.y) {
      multiplierY = 1;
    } else {
      multiplierY = 0;
    }
    const passedPosition: Position = {
      x: initialPosition.x + multiplierX,
      y: initialPosition.y + multiplierY,
    };
    if (samePosition(passedPosition, desiredPosition)) {
      if (
        !this.tileIsOccupied(desiredPosition, boardState) ||
        this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)
      ) {
        return true;
      }
    } else if (this.tileIsOccupied(passedPosition, boardState)) {
      return false;
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
        validMove = this.queenMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KING:
        validMove = this.kingMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;

      default:
        break;
    }

    return validMove;
  }
}
