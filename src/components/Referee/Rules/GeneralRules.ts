import { Position, Piece, samePosition, TeamType } from "../../../Constants";

export const tileIsOccupied = (
  position: Position,
  boardState: Piece[]
): boolean => {
  return !!boardState.find((p) => samePosition(p.position, position));
};

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  return !!boardState.find(
    (p) => samePosition(p.position, position) && p.team !== team
  );
};
