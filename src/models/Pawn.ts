import { PieceType, TeamType } from "../Types";
import Piece from "./Piece";
import Position from "./Position";

export default class Pawn extends Piece {
  enPassant?: boolean;

  constructor(
    position: Position,
    team: TeamType,
    hasMoved: boolean,
    enPassant?: boolean,
    possibleMoves: Position[] = []
  ) {
    super(position, PieceType.PAWN, team, hasMoved, possibleMoves);
    this.enPassant = enPassant;
  }

  clone(): Pawn {
    return new Pawn(
      this.position.clone(),
      this.team,
      this.hasMoved,
      this.enPassant,
      this.possibleMoves?.map((p) => p.clone())
    );
  }
}
