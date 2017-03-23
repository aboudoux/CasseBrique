using System;
using System.Collections.Generic;
using System.Linq;

namespace CasseBrique
{
    internal class CollisionManager
    {
        private readonly GameBoard _gameBoard;
        private readonly Plateau _plateau;
        private readonly Ball _ball;
        private readonly List<Brique> _briques;

        public CollisionManager(GameBoard gameBoard, Plateau plateau, Ball ball, List<Brique> briques )
        {
            if (gameBoard == null) throw new ArgumentNullException("gameBoard");
            if (plateau == null) throw new ArgumentNullException("plateau");
            if (ball == null) throw new ArgumentNullException("ball");
            if (briques == null) throw new ArgumentNullException("briques");
            _gameBoard = gameBoard;
            _plateau = plateau;
            _ball = ball;
            _briques = briques;
        }

        public CollisionResult CheckCollision()
        {
            if(BallTouchBottomGameBoard())
                return CollisionResult.BottomTouched;
            if (BallTouchLeftBorder() || BallTouchRightBorder())
                _ball.Bounce();
            if (BallTouchTopGameBoard())
                _ball.Bounce(BounceDirection.Reverse);
            if(BallTouchPlateau())
                _ball.Bounce(_plateau.GetBounceDirection(_ball.Left));

            var brique = GetBriqueTouchedByBall();
            if (brique != null)
            {
                _briques.Remove(brique);
                brique.Destroy();
                _ball.Bounce(BounceDirection.Reverse);
                return CollisionResult.BriqueTouched;
            }

            return CollisionResult.Nothing;
        }

        private Brique GetBriqueTouchedByBall()
        {
            const int retractation = 5;
            return _briques.FirstOrDefault(brique => brique.Left <= _ball.Left + retractation &&
                                                     brique.Right >= _ball.Right - retractation &&
                                                     brique.Top <= _ball.Top + retractation &&
                                                     brique.Bottom >= _ball.Bottom - retractation);
        }

        private bool BallTouchTopGameBoard()
        {
            return _ball.Top == _gameBoard.Top;
        }

        private bool BallTouchPlateau()
        {
            return _ball.Bottom == _plateau.Top && _ball.Left >= _plateau.Left && _ball.Right <= _plateau.Right;
        }

        private bool BallTouchRightBorder()
        {
            return _ball.Right >= _gameBoard.Right;
        }

        private bool BallTouchLeftBorder()
        {
            return _ball.Left <= _gameBoard.Left;
        }

        private bool BallTouchBottomGameBoard()
        {
            return _ball.Bottom >= _gameBoard.Height;
        }
    }
}