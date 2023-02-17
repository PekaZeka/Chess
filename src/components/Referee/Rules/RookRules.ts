import { Position, TeamType, Piece, samePosition } from "../../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

function rookMove(
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean {
  for (let i = 1; i < 8; i += 1) {
    //  VERTICAL MOVEMENT
    if (initialPosition.x === desiredPosition.x) {
      const multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;

      const passedPosition: Position = {
        x: initialPosition.x,
        y: initialPosition.y + i * multiplier,
      };
      if (samePosition(passedPosition, desiredPosition)) {
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

      const passedPosition: Position = {
        x: initialPosition.x + i * multiplier,
        y: initialPosition.y,
      };
      if (samePosition(passedPosition, desiredPosition)) {
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
}

export default rookMove;
