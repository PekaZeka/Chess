import Position from "../../models/Position";
import Piece from "../../models/Piece";
import { TeamType } from "../../Types";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      // TOP AND BOTTOM SIDE MOVEMENT
      if (desiredPosition.y - initialPosition.y === 2 * i) {
        if (desiredPosition.x - initialPosition.x === j) {
          return (
            !tileIsOccupied(desiredPosition, boardState) ||
            tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          );
        }
      }
      // LEFT AND RIGHT SIDE MOVEMENT
      if (desiredPosition.x - initialPosition.x === 2 * i) {
        if (desiredPosition.y - initialPosition.y === j) {
          return (
            !tileIsOccupied(desiredPosition, boardState) ||
            tileIsOccupiedByOpponent(desiredPosition, boardState, team)
          );
        }
      }
    }
  }
  return false;
};

export const getPossibleKnightMoves = (
  knight: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove = new Position(
        knight.position.x + j,
        knight.position.y + i * 2
      );
      const horizontalMove = new Position(
        knight.position.x + i * 2,
        knight.position.y + j
      );

      if (
        !tileIsOccupied(verticalMove, boardState) ||
        tileIsOccupiedByOpponent(verticalMove, boardState, knight.team)
      ) {
        possibleMoves.push(verticalMove);
      }
      if (
        !tileIsOccupied(horizontalMove, boardState) ||
        tileIsOccupiedByOpponent(horizontalMove, boardState, knight.team)
      ) {
        possibleMoves.push(horizontalMove);
      }
    }
  }

  return possibleMoves;
};
