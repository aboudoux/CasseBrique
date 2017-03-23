namespace CasseBrique
{
    internal class Lives : GameElement
    {
        private int _lives = 3;
        public Lives() : base("lives")
        {            
        }

        public int Decrement()
        {
            Div.InnerHTML = "Lives : " + --_lives;
            return _lives;
        }
    }
}