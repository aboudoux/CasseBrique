using System;
using Bridge.Html5;

namespace CasseBrique
{
    internal class Infos : GameElement
    {
        public Infos() : base("infos")
        {
        }

        protected Infos(String id) : base(id) {
        }

        public void Hide()
        {
            Div.Style.Visibility = Visibility.Hidden;
        }

        public void ShowPressToStart()
        {
            Div.InnerHTML = "Click to play";
            Div.Style.Visibility = Visibility.Visible;
        }

        public void ShowGameOver()
        {
            Div.InnerHTML = "GAME OVER</br>Press F5 to replay";
            Div.Style.Visibility = Visibility.Visible;
        }
    }
}