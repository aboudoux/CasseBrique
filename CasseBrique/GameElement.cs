using System;
using Bridge.Html5;

namespace CasseBrique
{
    internal abstract class GameElement
    {
        protected HTMLDivElement Div { get; set; }

        protected GameElement(string id)
        {
            Div = Document.GetElementById<HTMLDivElement>(id);
            if (Div == null)
                throw new Exception("div with id " + id + " not found");
        }

        protected GameElement(HTMLDivElement div)
        {
            if (div == null) throw new ArgumentNullException("div");
            Div = div;
        }

        public int Left {get { return Div.OffsetLeft; } set { Div.Style.Left = value + "px"; } }
        public int Right {get { return Left + Width; } }
        public int Width {get { return Div.OffsetWidth; } set { Div.Style.Width = value + "px"; } }
        public int Top {get { return Div.OffsetTop; } set { Div.Style.Top = value + "px"; } }
        public int Height {get { return Div.OffsetHeight; } set { Div.Style.Height = value + "px"; } }
        public int Bottom { get { return Top + Height; } }

        public static implicit operator Node(GameElement g)
        {
            return g.Div;
        }
    }
}