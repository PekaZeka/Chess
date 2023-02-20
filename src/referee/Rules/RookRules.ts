import { Position, TeamType, Piece, samePosition } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const rookMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
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
          !tileIsOccupied(desiredPosition, boardState) ||
          tileIsOccupiedByOpponent(desiredPosition, boardState, team)
        ) {
          return true;
        }
      }
      if (tileIsOccupied(passedPosition, boardState)) {
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
          !tileIsOccupied(desiredPosition, boardState) ||
          tileIsOccupiedByOpponent(desiredPosition, boardState, team)
        ) {
          return true;
        }
      }
      if (tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }
  return false;
};

export const getPossibleRookMoves = (
  rook: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  // UP
  for (let i = 1; i < 8; i += 1) {
    const destination: Position = {
      x: rook.position.x,
      y: rook.position.y + i,
    };
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // DOWN
  for (let i = 1; i < 8; i += 1) {
    const destination: Position = {
      x: rook.position.x,
      y: rook.position.y - i,
    };
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // LEFT
  for (let i = 1; i < 8; i += 1) {
    const destination: Position = {
      x: rook.position.x - i,
      y: rook.position.y,
    };
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // RIGHT
  for (let i = 1; i < 8; i += 1) {
    const destination: Position = {
      x: rook.position.x + i,
      y: rook.position.y,
    };
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
