import Position from "../../models/Position";
import Piece from "../../models/Piece";
import { TeamType } from "../../Types";
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

      const passedPosition = new Position(
        initialPosition.x,
        initialPosition.y + i * multiplier
      );
      if (passedPosition.samePosition(desiredPosition)) {
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

      const passedPosition = new Position(
        initialPosition.x + i * multiplier,
        initialPosition.y
      );
      if (passedPosition.samePosition(desiredPosition)) {
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
    const destination = new Position(rook.position.x, rook.position.y + i);
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
    const destination = new Position(rook.position.x, rook.position.y - i);
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
    const destination = new Position(rook.position.x - i, rook.position.y);
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
    const destination = new Position(rook.position.x + i, rook.position.y);
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
