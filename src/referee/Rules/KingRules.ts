/* eslint-disable import/no-cycle */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
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

// In this method the enemy moves have already been calculated
export const getCastlingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  if (king.hasMoved) return possibleMoves;

  // We get the rooks from the king's team which haven't moved
  const rooks = boardState.filter(
    (p) => p.isRook && p.team === king.team && !p.hasMoved
  );

  // Loop through the rooks
  for (const rook of rooks) {
    // Determine if we need to go to the right or the left side
    const direction = rook.position.x - king.position.x > 0 ? 1 : -1;

    const adjacentPosition = king.position.clone();
    adjacentPosition.x += direction;

    // Check if the rook can move to the adjacent tile of the king
    if (!rook.possibleMoves?.some((m) => m.samePosition(adjacentPosition)))
      continue;

    const concerningTiles = rook.possibleMoves.filter(
      (m) => m.y === king.position.y
    );

    const enemyPieces = boardState.filter((p) => p.team !== king.team);

    // Checking if any of the enemy pieces can attack the tiles
    // between the rook and the king
    let valid = true;

    if (
      enemyPieces.some((p) =>
        p.possibleMoves?.some((m) =>
          concerningTiles.some((t) => t.samePosition(m))
        )
      )
    ) {
      valid = false;
    }

    if (!valid) continue;

    // We now want to add it as a possible move
    possibleMoves.push(rook.position.clone());
  }
  return possibleMoves;
};
