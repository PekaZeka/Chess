import {
  Position,
  TeamType,
  Piece,
  samePosition,
  PieceType,
} from "../../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const specialRow = team === TeamType.OUR ? 1 : 6;
  const pawnDirection = team === TeamType.OUR ? 1 : -1;
  // MOVEMENT LOGIC
  if (
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === specialRow &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection
  ) {
    return (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied(
        { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
        boardState
      )
    );
  }
  if (
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    return !tileIsOccupied(desiredPosition, boardState);
  }
  // ATTACK LOGIC
  if (
    desiredPosition.x - initialPosition.x === -1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    return tileIsOccupiedByOpponent(desiredPosition, boardState, team);
  }
  if (
    desiredPosition.x - initialPosition.x === 1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    return tileIsOccupiedByOpponent(desiredPosition, boardState, team);
  }
  return false;
};

export const getPossiblePawnMoves = (
  pawn: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  const normalMove: Position = {
    x: pawn.position.x,
    y: pawn.position.y + pawnDirection,
  };
  const specialMove: Position = {
    x: normalMove.x,
    y: normalMove.y + pawnDirection,
  };
  const upperLeftAttack: Position = {
    x: pawn.position.x - 1,
    y: pawn.position.y + 1,
  };
  const upperRightAttack: Position = {
    x: pawn.position.x + 1,
    y: pawn.position.y + 1,
  };
  const enPassantLeft: Position = {
    x: pawn.position.x - 1,
    y: pawn.position.y,
  };
  const enPassantRight: Position = {
    x: pawn.position.x + 1,
    y: pawn.position.y,
  };
  // ONE TILE AHEAD
  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);
    // ONE/TWO TILEs AHEAD IF FIRST MOVE
    if (
      pawn.position.y === specialRow &&
      !tileIsOccupied(specialMove, boardState)
    ) {
      possibleMoves.push(specialMove);
    }
  }
  // ATTACK DIAGONALLY
  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  }
  // ATTACK DIAGONALLY
  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  }
  // ATTACK DIAGONALLY ENPASSANT
  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find((p) =>
      samePosition(p.position, enPassantLeft)
    );
    if (
      leftPiece != null &&
      leftPiece.type === PieceType.PAWN &&
      leftPiece.enPassant
    ) {
      possibleMoves.push(upperLeftAttack);
    }
  }
  // ATTACK DIAGONALLY ENPASSANT
  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const leftPiece = boardState.find((p) =>
      samePosition(p.position, enPassantRight)
    );
    if (leftPiece != null && leftPiece.enPassant) {
      possibleMoves.push(upperRightAttack);
    }
  }

  return possibleMoves;
};

// TODO
// ADD down left and right attack preview
