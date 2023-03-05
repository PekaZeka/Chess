import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 8; i += 1) {
    // DIAGONAL MOVEMENT
    const multiplierX = desiredPosition.x < initialPosition.x ? -1 : 1;
    const multiplierY = desiredPosition.y < initialPosition.y ? -1 : 1;

    const passedPosition = new Position(
      initialPosition.x + i * multiplierX,
      initialPosition.y + i * multiplierY
    );
    if (passedPosition.samePosition(desiredPosition)) {
      if (
        !tileIsOccupied(desiredPosition, boardState) ||
        tileIsOccupiedByOpponent(desiredPosition, boardState, team)
      ) {
        return true;
      }
    } else if (tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  return false;
};

export const getPossibleBishopMoves = (
  bishop: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  // TOP RIGHT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      bishop.position.x + i,
      bishop.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // BOT RIGHT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      bishop.position.x + i,
      bishop.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // TOP LEFT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      bishop.position.x - i,
      bishop.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // BOT LEFT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      bishop.position.x - i,
      bishop.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  return possibleMoves;
};
