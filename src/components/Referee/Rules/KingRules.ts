import { Position, TeamType, Piece, samePosition } from "../../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

function kingMove(
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean {
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
  const passedPosition: Position = {
    x: initialPosition.x + multiplierX,
    y: initialPosition.y + multiplierY,
  };
  if (samePosition(passedPosition, desiredPosition)) {
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
}

export default kingMove;
