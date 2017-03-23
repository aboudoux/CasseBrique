using Bridge.Html5;

namespace CasseBrique
{
    internal class Brique : GameElement
    {
        public Brique(int left, int top) 
            : base(new HTMLDivElement()
            {
                ClassName = "ball",
                Style = { Left = left + "px", Top = top + "px"}
            })
        {
        }

        public void Destroy()
        {
            Div.Remove();
        }
    }
}