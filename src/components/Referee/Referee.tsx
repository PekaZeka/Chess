/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import { Board, Pawn, Piece, Position } from "../../models";
import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../../referee/Rules";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/Chessboard";

export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  function updatePossibleMoves() {
    board.calculateAllMoves();
  }

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ): boolean {
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = pawnMove(
          initialPosition,
          desiredPosition,
          team,
          board.pieces
        );
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(
          initialPosition,
          desiredPosition,
          team,
          board.pieces
        );
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(
          initialPosition,
          desiredPosition,
          team,
          board.pieces
        );
        break;
      case PieceType.ROOK:
        validMove = rookMove(
          initialPosition,
          desiredPosition,
          team,
          board.pieces
        );
        break;
      case PieceType.QUEEN:
        validMove = queenMove(
          initialPosition,
          desiredPosition,
          team,
          board.pieces
        );
        break;
      case PieceType.KING:
        validMove = kingMove(
          initialPosition,
          desiredPosition,
          team,
          board.pieces
        );
        break;

      default:
        break;
    }

    return validMove;
  }

  function playMove(playedPiece: Piece, destination: Position): boolean {
    let playedMoveIsValid = false;

    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    // playMove modifies the board thus we need to call setBoard
    setBoard((previousBoard) => {
      // Playing the move
      playedMoveIsValid = board.playMove(
        enPassantMove,
        playedPiece,
        validMove,
        destination
      );

      return board.clone();
    });

    // This is for promoting a pawn
    const promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;

    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn(playedPiece);
    }

    return playedMoveIsValid;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    board.pieces = board.pieces.reduce((results, piece) => {
      if (piece.samePiecePosition(promotionPawn)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.OUR ? "white" : "black";
        piece.image = `assets/images/${teamType}_${pieceType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);
    updatePossibleMoves();
    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "white" : "black";
  }

  return (
    <>
      <div className="modal-overlay hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_rook.png`}
            alt="rook"
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_bishop.png`}
            alt="bishop"
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_knight.png`}
            alt="knight"
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_queen.png`}
            alt="queen"
          />
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={board.pieces} />
    </>
  );
}
