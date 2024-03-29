import Position from "../../models/Position";
import Piece from "../../models/Piece";
import { TeamType } from "../../Types";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const queenMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
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

export const getPossibleQueenMoves = (
  queen: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  // UP
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(queen.position.x, queen.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // DOWN
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(queen.position.x, queen.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // LEFT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(queen.position.x - i, queen.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // RIGHT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(queen.position.x + i, queen.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // TOP RIGHT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      queen.position.x + i,
      queen.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // BOT RIGHT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      queen.position.x + i,
      queen.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // TOP LEFT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      queen.position.x - i,
      queen.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  // BOT LEFT
  for (let i = 1; i < 8; i += 1) {
    const destination = new Position(
      queen.position.x - i,
      queen.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
