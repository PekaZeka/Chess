import Position from "../../models/Position";
import Piece from "../../models/Piece";
import { TeamType } from "../../Types";

export const tileIsOccupied = (
  position: Position,
  boardState: Piece[]
): boolean => {
  const piece = boardState.find((p) => p.samePosition(position));

  if (piece) {
    return true;
  }
  return false;
};

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = boardState.find(
    (p) => p.samePosition(position) && p.team !== team
  );
  if (piece) {
    return true;
  }
  return false;
};

export const moveOutsideBoard = (destination: Position): boolean => {
  if (
    destination.x < 0 ||
    destination.x > 7 ||
    destination.y < 0 ||
    destination.y > 7
  ) {
    return true;
  }
  return false;
};
