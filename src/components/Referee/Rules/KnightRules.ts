import { Position, TeamType, Piece } from "../../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

function knightMove(
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean {
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
}

export default knightMove;
