import { Position, TeamType, Piece, samePosition } from "../../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

function bishopMove(
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean {
  for (let i = 1; i < 8; i += 1) {
    // DIAGONAL MOVEMENT
    const multiplierX = desiredPosition.x < initialPosition.x ? -1 : 1;
    const multiplierY = desiredPosition.y < initialPosition.y ? -1 : 1;

    const passedPosition: Position = {
      x: initialPosition.x + i * multiplierX,
      y: initialPosition.y + i * multiplierY,
    };
    if (samePosition(passedPosition, desiredPosition)) {
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
}

export default bishopMove;
