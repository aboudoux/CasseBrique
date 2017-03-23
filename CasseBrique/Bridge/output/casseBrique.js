Bridge.assembly("CasseBrique", function ($asm, globals) {
    "use strict";

    Bridge.define("CasseBrique.App", {
        statics: {
            config: {
                init: function () {
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                CasseBrique.GameBoard.open();
            }
        },
        $entryPoint: true
    });

    Bridge.define("CasseBrique.GameElement", {
        statics: {
            op_Implicit: function (g) {
                return g.getDiv();
            }
        },
        config: {
            properties: {
                Div: null
            }
        },
        $ctor1: function (id) {
            this.$initialize();
            this.setDiv(document.getElementById(id));
            if (this.getDiv() == null) {
                throw new System.Exception(System.String.concat(System.String.concat("div with id ", id), " not found"));
            }
        },
        ctor: function (div) {
            this.$initialize();
            if (div == null) {
                throw new System.ArgumentNullException("div");
            }
            this.setDiv(div);
        },
        getLeft: function () {
            return this.getDiv().offsetLeft;
        },
        setLeft: function (value) {
            this.getDiv().style.left = System.String.concat(value, "px");
        },
        getRight: function () {
            return ((this.getLeft() + this.getWidth()) | 0);
        },
        getWidth: function () {
            return this.getDiv().offsetWidth;
        },
        setWidth: function (value) {
            this.getDiv().style.width = System.String.concat(value, "px");
        },
        getTop: function () {
            return this.getDiv().offsetTop;
        },
        setTop: function (value) {
            this.getDiv().style.top = System.String.concat(value, "px");
        },
        getHeight: function () {
            return this.getDiv().offsetHeight;
        },
        setHeight: function (value) {
            this.getDiv().style.height = System.String.concat(value, "px");
        },
        getBottom: function () {
            return ((this.getTop() + this.getHeight()) | 0);
        }
    });

    Bridge.define("CasseBrique.BounceDirection", {
        $kind: "enum",
        statics: {
            Reverse: 0,
            Left: 1,
            Right: 2,
            Middle: 3
        }
    });

    Bridge.define("CasseBrique.CollisionManager", {
        _gameBoard: null,
        _plateau: null,
        _ball: null,
        _briques: null,
        ctor: function (gameBoard, plateau, ball, briques) {
            this.$initialize();
            if (gameBoard == null) {
                throw new System.ArgumentNullException("gameBoard");
            }
            if (plateau == null) {
                throw new System.ArgumentNullException("plateau");
            }
            if (ball == null) {
                throw new System.ArgumentNullException("ball");
            }
            if (briques == null) {
                throw new System.ArgumentNullException("briques");
            }
            this._gameBoard = gameBoard;
            this._plateau = plateau;
            this._ball = ball;
            this._briques = briques;
        },
        checkCollision: function () {
            if (this.ballTouchBottomGameBoard()) {
                return CasseBrique.CollisionResult.BottomTouched;
            }
            if (this.ballTouchLeftBorder() || this.ballTouchRightBorder()) {
                this._ball.bounce();
            }
            if (this.ballTouchTopGameBoard()) {
                this._ball.bounce$1(CasseBrique.BounceDirection.Reverse);
            }
            if (this.ballTouchPlateau()) {
                this._ball.bounce$1(this._plateau.getBounceDirection(this._ball.getLeft()));
            }

            var brique = this.getBriqueTouchedByBall();
            if (brique != null) {
                this._briques.remove(brique);
                brique.destroy();
                this._ball.bounce$1(CasseBrique.BounceDirection.Reverse);
                return CasseBrique.CollisionResult.BriqueTouched;
            }

            return CasseBrique.CollisionResult.Nothing;
        },
        getBriqueTouchedByBall: function () {
            var retractation = 5;
            return System.Linq.Enumerable.from(this._briques).firstOrDefault(Bridge.fn.bind(this, function (brique) {
                return brique.getLeft() <= ((this._ball.getLeft() + retractation) | 0) && brique.getRight() >= ((this._ball.getRight() - retractation) | 0) && brique.getTop() <= ((this._ball.getTop() + retractation) | 0) && brique.getBottom() >= ((this._ball.getBottom() - retractation) | 0);
            }), null);
        },
        ballTouchTopGameBoard: function () {
            return this._ball.getTop() === this._gameBoard.getTop();
        },
        ballTouchPlateau: function () {
            return this._ball.getBottom() === this._plateau.getTop() && this._ball.getLeft() >= this._plateau.getLeft() && this._ball.getRight() <= this._plateau.getRight();
        },
        ballTouchRightBorder: function () {
            return this._ball.getRight() >= this._gameBoard.getRight();
        },
        ballTouchLeftBorder: function () {
            return this._ball.getLeft() <= this._gameBoard.getLeft();
        },
        ballTouchBottomGameBoard: function () {
            return this._ball.getBottom() >= this._gameBoard.getHeight();
        }
    });

    Bridge.define("CasseBrique.CollisionResult", {
        $kind: "enum",
        statics: {
            Nothing: 0,
            BottomTouched: 1,
            BriqueTouched: 2
        }
    });

    Bridge.define("CasseBrique.Ball", {
        inherits: [CasseBrique.GameElement],
        _topDirection: 1,
        _leftDirection: 0,
        _startLeft: 0,
        _startTop: 0,
        ctor: function () {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, "ball");
            this._startLeft = this.getLeft();
            this._startTop = this.getTop();
        },
        move: function () {
            this.setTop((this.getTop() + this._topDirection) | 0);
            this.setLeft((this.getLeft() + this._leftDirection) | 0);
        },
        moveCenter: function () {
            this.setLeft(this._startLeft);
            this.setTop(this._startTop);
        },
        bounce$1: function (direction) {
            this._topDirection = (this._topDirection * (-1)) | 0;
            switch (direction) {
                case CasseBrique.BounceDirection.Middle: 
                    this._leftDirection = 0;
                    break;
                case CasseBrique.BounceDirection.Right: 
                    this._leftDirection = 1;
                    break;
                case CasseBrique.BounceDirection.Left: 
                    this._leftDirection = -1;
                    break;
            }
        },
        bounce: function () {
            this._leftDirection = (this._leftDirection * (-1)) | 0;
        }
    });

    Bridge.define("CasseBrique.Brique", {
        inherits: [CasseBrique.GameElement],
        ctor: function (left, top) {
            this.$initialize();
            CasseBrique.GameElement.ctor.call(this, Bridge.merge(document.createElement('div'), {
                className: "ball",
                style: {
                    left: System.String.concat(left, "px"), top: System.String.concat(top, "px")
                }
            } ));
        },
        destroy: function () {
            this.getDiv().remove();
        }
    });

    Bridge.define("CasseBrique.GameBoard", {
        inherits: [CasseBrique.GameElement],
        statics: {
            open: function () {
                new CasseBrique.GameBoard();
            }
        },
        _plateau: null,
        _briques: null,
        _ball: null,
        _infos: null,
        _lives: null,
        _score: null,
        _collisionManager: null,
        _intervaleId: 0,
        config: {
            init: function () {
                this._plateau = new CasseBrique.Plateau();
                this._briques = new (System.Collections.Generic.List$1(CasseBrique.Brique))();
                this._ball = new CasseBrique.Ball();
                this._infos = new CasseBrique.Infos.ctor();
                this._lives = new CasseBrique.Lives();
                this._score = new CasseBrique.Score();
            }
        },
        ctor: function () {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, "gameboard");
            Bridge.cast(this.getDiv(), HTMLElement).onmousemove = Bridge.fn.combine(Bridge.cast(this.getDiv(), HTMLElement).onmousemove, Bridge.fn.bind(this, $_.CasseBrique.GameBoard.f1));
            Bridge.cast(this.getDiv(), HTMLElement).onclick = Bridge.fn.combine(Bridge.cast(this.getDiv(), HTMLElement).onclick, Bridge.fn.bind(this, $_.CasseBrique.GameBoard.f2));
            this.createAllBrique(5);

            this._collisionManager = new CasseBrique.CollisionManager(this, this._plateau, this._ball, this._briques);
        },
        startGame: function () {
            if (this._intervaleId === 0) {
                this._infos.hide();
                this._intervaleId = window.setInterval(Bridge.fn.bind(this, this.tick), 1);
            }
        },
        tick: function () {
            this._ball.move();
            switch (this._collisionManager.checkCollision()) {
                case CasseBrique.CollisionResult.BottomTouched: 
                    this.stopGame();
                    if (this._lives.decrement() === 0) {
                        this._infos.showGameOver();
                        this._intervaleId = 1;
                    }
                    break;
                case CasseBrique.CollisionResult.BriqueTouched: 
                    this._score.increment();
                    if (this._briques.getCount() === 0) {
                        this.stopGame();
                        this.createAllBrique(5);
                    }
                    break;
            }
        },
        stopGame: function () {
            window.clearInterval(this._intervaleId);
            this._intervaleId = 0;
            this._ball.moveCenter();
            this._infos.showPressToStart();
        },
        createAllBrique: function (nbrRow) {
            var $t;
            for (var row = 0; row < nbrRow; row = (row + 1) | 0) {
                for (var i = 0; i < 46; i = (i + 1) | 0) {
                    this._briques.add(new CasseBrique.Brique(((((this.getLeft() + (((10 * i) | 0))) | 0) + i) | 0), ((100 + (((row * 11) | 0))) | 0)));
                }
            }

            $t = Bridge.getEnumerator(this._briques);
            while ($t.moveNext()) {
                var brique = $t.getCurrent();
                document.body.appendChild(CasseBrique.GameElement.op_Implicit(brique));
            }
        }
    });

    var $_ = {};

    Bridge.ns("CasseBrique.GameBoard", $_);

    Bridge.apply($_.CasseBrique.GameBoard, {
        f1: function (m) {
            this._plateau.moveHorizontal(m.clientX, this.getWidth());
        },
        f2: function (m) {
            this.startGame();
        }
    });

    Bridge.define("CasseBrique.Infos", {
        inherits: [CasseBrique.GameElement],
        ctor: function () {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, "infos");
        },
        $ctor1: function (id) {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, id);
        },
        hide: function () {
            this.getDiv().style.visibility = "hidden";
        },
        showPressToStart: function () {
            this.getDiv().innerHTML = "Click to play";
            this.getDiv().style.visibility = "visible";
        },
        showGameOver: function () {
            this.getDiv().innerHTML = "GAME OVER</br>Press F5 to replay";
            this.getDiv().style.visibility = "visible";
        }
    });

    Bridge.define("CasseBrique.Lives", {
        inherits: [CasseBrique.GameElement],
        _lives: 3,
        ctor: function () {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, "lives");
        },
        decrement: function () {
            this.getDiv().innerHTML = System.String.concat("Lives : ", ((this._lives = (this._lives - 1) | 0)));
            return this._lives;
        }
    });

    Bridge.define("CasseBrique.Plateau", {
        inherits: [CasseBrique.GameElement],
        ctor: function () {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, "plateau");
        },
        moveHorizontal: function (x, gameboardWidth) {
            this.setLeft(Math.min(((gameboardWidth - this.getWidth()) | 0), x));
        },
        getBounceDirection: function (ballLeft) {
            if (ballLeft >= ((this.getLeft() + 40) | 0) && ballLeft <= ((this.getLeft() + 50) | 0)) {
                return CasseBrique.BounceDirection.Middle;
            }
            if (ballLeft < ((this.getLeft() + 40) | 0)) {
                return CasseBrique.BounceDirection.Left;
            }
            if (ballLeft >= ((this.getLeft() + 50) | 0)) {
                return CasseBrique.BounceDirection.Right;
            }

            return CasseBrique.BounceDirection.Middle;
        }
    });

    Bridge.define("CasseBrique.Score", {
        inherits: [CasseBrique.GameElement],
        _score: 0,
        ctor: function () {
            this.$initialize();
            CasseBrique.GameElement.$ctor1.call(this, "score");
        },
        increment: function () {
            this.getDiv().innerHTML = System.String.concat("Score : ", ((this._score = (this._score + 1) | 0)));
        }
    });
});
