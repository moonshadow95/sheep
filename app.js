import { Hill } from "./hill.js";
import { SheepController } from "./sheep_controller.js";
import { Sun } from "./sun.js";

class App {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.sun = new Sun();

        this.hills = [
            new Hill("#F28F38", 0.2, 12),
            new Hill("#F2AA52", 0.5, 8),
            new Hill("#F2CD5E", 1, 6),
        ];

        this.SheepController = new SheepController();

        //resize 이벤트 핸들러 생성, resize는 window에만 사용 가능하지만 bind를 사용하여 App 오브젝트에 적용함
        window.addEventListener("resize", this.resize.bind(this), false);
        //resize 이벤트 불러옴
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
    }

    //canvas의 사이즈를 2배로 하여 레티나 디스플레이(픽셀 수 2배)에서도 잘 보이게 함
    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2);
        //해 생성
        this.sun.resize(this.stageWidth, this.stageHeight);
        //언덕 생성
        for (let i = 0; i < this.hills.length; i++) {
            this.hills[i].resize(this.stageWidth, this.stageHeight);
        }
        //양 생성
        this.SheepController.resize(this.stageWidth, this.stageHeight);
    }

    animate(t) {
        requestAnimationFrame(this.animate.bind(this));

        //canvas를 깨끗하게 지움
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.sun.draw(this.ctx, t);
        let dots;
        for (let i = 0; i < this.hills.length; i++) {
            dots = this.hills[i].draw(this.ctx);
        }
        //fps를 위한 t = timeStamp, 마지막 점(화면 바깥)에 양을 그리기 위한 dots
        this.SheepController.draw(this.ctx, t, dots);
    }
}

window.onload = () => {
    new App();
};
