/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import {
  getPossiblePawnMoves,
  getPossibleKnightMoves,
  getPossibleBishopMoves,
  getPossibleRookMoves,
  getPossibleQueenMoves,
  getPossibleKingMoves,
  getCastlingMoves,
} from "../referee/Rules";
import { PieceType, TeamType } from "../Types";
import Pawn from "./Pawn";
import Piece from "./Piece";
import Position from "./Position";

export default class Board {
  pieces: Piece[];

  totalTurns: number;

  winningTeam?: TeamType;

  constructor(pieces: Piece[], totalTurns: number) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  calculateAllMoves() {
    // Calculate the moves of all the pieces
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }

    // Calculate castling moves
    for (const king of this.pieces.filter((p) => p.isKing)) {
      if (king.possibleMoves === undefined) continue;
      king.possibleMoves = [
        ...king.possibleMoves,
        ...getCastlingMoves(king, this.pieces),
      ];
    }

    // Check if the current team moves are valid
    this.checkCurrentTeamMoves();

    // Remove the possible moves for the team that is not playing
    for (const piece of this.pieces.filter(
      (p) => p.team !== this.currentTeam
    )) {
      piece.possibleMoves = [];
    }

    // Check if the playing team still has moves left
    // Otherwise, checkmate!
    if (
      this.pieces
        .filter((p) => p.team === this.currentTeam)
        .some(
          (p) => p.possibleMoves !== undefined && p.possibleMoves.length > 0
        )
    ) {
      return;
    }
    Piece.playSound("Checkmate");
    console.log("Checkmate");
    this.winningTeam =
      this.currentTeam === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
  }

  get currentTeam(): TeamType {
    return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
  }

  checkCurrentTeamMoves() {
    let kingChecked = false;

    // Get the current team's king
    const king = this.pieces.find(
      (p) => p.isKing && p.team === this.currentTeam
    )!;

    // Loop through all the current team's pieces
    for (const piece of this.pieces.filter(
      (p) => p.team === this.currentTeam
    )) {
      if (piece.possibleMoves === undefined) continue;

      // Simulate all the piece moves
      for (const move of piece.possibleMoves) {
        const simulatedBoard = this.clone();

        // Remove the piece at the destination position
        simulatedBoard.pieces = simulatedBoard.pieces.filter(
          (p) => !p.samePosition(move)
        );

        // Get the piece of the cloned board
        const clonedPiece = simulatedBoard.pieces.find((p) =>
          p.samePiecePosition(piece)
        )!;
        clonedPiece.position = move.clone();

        // Get the king of the cloned board
        const clonedKing = simulatedBoard.pieces.find(
          (p) => p.isKing && p.team === simulatedBoard.currentTeam
        )!;

        let moveValid = true;

        // Loop through all enemy pieces, update their possible moves
        // And check if the current team's king will be in danger
        for (const enemy of simulatedBoard.pieces.filter(
          (p) => p.team !== simulatedBoard.currentTeam
        )) {
          enemy.possibleMoves = simulatedBoard.getValidMoves(
            enemy,
            simulatedBoard.pieces
          );

          if (
            enemy.possibleMoves.some((m) => m.samePosition(clonedKing.position))
          ) {
            moveValid = false;
            break;
          }
        }

        if (!moveValid) {
          piece.possibleMoves = piece.possibleMoves.filter(
            (m) => !m.samePosition(move)
          );
        } else {
          // The move doesn't put the king in danger, so check if the king is already in check
          for (const enemy of this.pieces.filter(
            (p) => p.team !== this.currentTeam
          )) {
            enemy.possibleMoves = this.getValidMoves(enemy, this.pieces);

            if (
              enemy.possibleMoves.some((m) => m.samePosition(king.position))
            ) {
              kingChecked = true;
              break;
            }
          }
        }
      }
    }

    if (kingChecked) {
      Piece.playSound("Check");
      console.log("Check");
    }
  }

  playMove(
    enPassantMove: boolean,
    playedPiece: Piece,
    validMove: boolean,
    destination: Position
  ): boolean {
    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
    const destinationPiece = this.pieces.find((p) =>
      p.samePosition(destination)
    );

    // Logic for castling
    if (
      playedPiece.isKing &&
      destinationPiece?.isRook &&
      destinationPiece.team === playedPiece.team
    ) {
      const direction =
        destinationPiece.position.x - playedPiece.position.x > 0 ? 1 : -1;
      const newKingXPosition = playedPiece.position.x + direction * 2;

      this.pieces = this.pieces.map((p) => {
        if (p.samePiecePosition(playedPiece)) {
          p.position.x = newKingXPosition;
        } else if (p.samePiecePosition(destinationPiece)) {
          p.position.x = newKingXPosition - direction;
        }

        return p;
      });
      this.calculateAllMoves();
      Piece.playSound("Castling");
      console.log("Castling");
      return true;
    }

    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) (piece as Pawn).enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;

          piece.hasMoved = true;

          results.push(piece);
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y - pawnDirection)
          )
        ) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      this.calculateAllMoves();
    } else if (validMove) {
      // Updates the piece position and if a piece is attacked, removes it
      this.pieces = this.pieces.reduce((results, piece) => {
        // Piece we are currently moving
        if (piece.samePiecePosition(playedPiece)) {
          // En passant move
          if (piece.isPawn) {
            (piece as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2 &&
              piece.type === PieceType.PAWN;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;

          piece.hasMoved = true;

          results.push(piece);
        } else if (!piece.samePosition(destination)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        // The piece at the destination location
        // Won't be pushed in the results
        return results;
      }, [] as Piece[]);

      let kingChecked = false;
      for (const piece of this.pieces.filter(
        (p) => p.team !== this.currentTeam
      )) {
        piece.possibleMoves = this.getValidMoves(piece, this.pieces);

        const king = this.pieces.find(
          (p) => p.isKing && p.team === this.currentTeam
        )!;

        if (piece.possibleMoves.some((m) => m.samePosition(king.position))) {
          kingChecked = true;
          break;
        }
      }

      if (destinationPiece && !kingChecked) {
        Piece.playSound("Capture");
        console.log("Capture");
      } else if (!kingChecked) {
        Piece.playSound("Move");
        console.log("Move");
      }

      this.calculateAllMoves();
    } else {
      // Check if the king is in check
      const king = this.pieces.find(
        (p) => p.isKing && p.team === this.currentTeam
      )!;

      let kingChecked = false;

      for (const enemy of this.pieces.filter(
        (p) => p.team !== this.currentTeam
      )) {
        enemy.possibleMoves = this.getValidMoves(enemy, this.pieces);

        if (enemy.possibleMoves.some((m) => m.samePosition(king.position))) {
          kingChecked = true;
          break;
        }
      }

      if (kingChecked) {
        Piece.playSound("InCheck");
        console.log("InCheck");
      }

      return true;
    }

    return true;
  }

  clone(): Board {
    return new Board(
      this.pieces.map((p) => p.clone()),
      this.totalTurns
    );
  }
}
