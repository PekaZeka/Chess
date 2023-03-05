import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
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
  const passedPosition = new Position(
    initialPosition.x + multiplierX,
    initialPosition.y + multiplierY
  );
  if (passedPosition.samePosition(desiredPosition)) {
    if (
      !tileIsOccupied(desiredPosition, boardState) ||
      tileIsOccupiedByOpponent(desiredPosition, boardState, team)
    ) {
      return true;
    }
  } else if (tileIsOccupied(passedPosition, boardState)) {
    return false;
  }
  return false;
};

export const getPossibleKingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  // UP
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x, king.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // DOWN
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x, king.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // LEFT
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x - i, king.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // RIGHT
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x + i, king.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // TOP RIGHT
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x + i, king.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // BOT RIGHT
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x + i, king.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // TOP LEFT
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x - i, king.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // BOT LEFT
  for (let i = 1; i < 2; i += 1) {
    const destination = new Position(king.position.x - i, king.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
