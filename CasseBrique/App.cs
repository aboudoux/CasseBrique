using Bridge.Html5;

namespace CasseBrique
{
    public class App
    {
        [Ready]
        public static void Main()
        {
            GameBoard.Open();
        }
    }
}