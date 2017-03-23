namespace CasseBrique
{
    internal class Score : GameElement
    {
        private int _score = 0;
        public Score() : base("score")
        {
        }

        public void Increment()
        {
            Div.InnerHTML = "Score : " + ++_score;
        }
    }
}