namespace CasseBrique
{
    internal class Ball : GameElement
    {
        private int _topDirection = 1;
        private int _leftDirection;

        private readonly int _startLeft;
        private readonly int _startTop;

        public Ball() : base("ball")
        {
            _startLeft = Left;
            _startTop = Top;
        }        

        public void Move()
        {
            Top = Top + _topDirection;
            Left = Left + _leftDirection;
        }

        public void MoveCenter()
        {
            Left = _startLeft;
            Top = _startTop;
        }

        public void Bounce(BounceDirection direction)
        {            
            _topDirection *= -1;
            switch (direction)
            {
                case BounceDirection.Middle:
                    _leftDirection = 0;
                    break;
                case BounceDirection.Right:
                    _leftDirection = 1;
                    break;
                case BounceDirection.Left:
                    _leftDirection = -1;
                    break;
            }
        }

        public void Bounce()
        {
            _leftDirection *= -1;
        }
    }
}