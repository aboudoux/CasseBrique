using System.Collections.Generic;
using Bridge.Html5;

namespace CasseBrique
{
    internal class GameBoard : GameElement
    {
        private readonly Plateau _plateau = new Plateau();
        private readonly List<Brique> _briques = new List<Brique>();
        private readonly Ball _ball = new Ball();
        private readonly Infos _infos = new Infos();
        private readonly Lives _lives = new Lives();
        Score _score = new Score();

        private readonly CollisionManager _collisionManager;

        public static void Open()
        {
            new GameBoard();
        }

        private GameBoard() : base("gameboard")
        {
            ((HTMLElement) Div).OnMouseMove += m => _plateau.MoveHorizontal(m.ClientX, Width);
            ((HTMLElement) Div).OnClick += m => StartGame();
            CreateAllBrique(5);

            _collisionManager = new CollisionManager(this, _plateau, _ball, _briques);
        }

        private int _intervaleId = 0;
        private void StartGame()
        {
            if (_intervaleId == 0)
            {
                _infos.Hide();
                _intervaleId = Window.SetInterval(Tick, 1);
            }
        }

        private void Tick()
        {
            _ball.Move();
            switch (_collisionManager.CheckCollision())
            {
                case CollisionResult.BottomTouched:
                    StopGame();
                    if (_lives.Decrement() == 0)
                    {
                        _infos.ShowGameOver();
                        _intervaleId = 1;
                    }
                    break;
                case CollisionResult.BriqueTouched:
                    _score.Increment();
                    if (_briques.Count == 0)
                    {
                        StopGame();
                        CreateAllBrique(5);
                    }
                    break;
            }
        }

        private void StopGame()
        {
            Window.ClearInterval(_intervaleId);
            _intervaleId = 0;
            _ball.MoveCenter();
            _infos.ShowPressToStart();
        }

        private void CreateAllBrique(int nbrRow)
        {
            for (int row = 0; row < nbrRow; row++)
            {
                for( int i = 0; i < 46; i++)
                    _briques.Add(new Brique(Left + (10*i) + i, 100 + (row * 11)));
            }

            foreach (var brique in _briques)
            {
                Document.Body.AppendChild(brique);
            }
        }
    }
}