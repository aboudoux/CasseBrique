using System;

namespace CasseBrique
{
    internal class Plateau : GameElement
    {
        public Plateau() : base("plateau")
        {
        }

        public void MoveHorizontal(int x, int gameboardWidth)
        {
            Left = Math.Min(gameboardWidth - Width, x);
        }

        public BounceDirection GetBounceDirection(int ballLeft)
        {
            if( ballLeft >= Left + 40 && ballLeft <= Left + 50)
                return BounceDirection.Middle;
            if( ballLeft < Left + 40 )
                return  BounceDirection.Left;
            if(ballLeft >= Left +50)
                return BounceDirection.Right;

            return BounceDirection.Middle;
        }
    }
}