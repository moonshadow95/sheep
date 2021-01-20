export class Sun {
    constructor() {
        this.radius = 60;

        this.total = 60;
        this.gap = 1 / this.total;
        this.originPos = [];
        this.pos = [];
        for (let i = 0; i < this.total; i++) {
            const pos = this.getCirclePoint(this.radius, this.gap * i);
            this.originPos[i] = pos;
            this.pos[i] = pos;
        }
        this.fps = 10;
        this.fpsTime = 1000 / this.fps;
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.x = this.stageWidth - this.radius - 200;
        this.y = this.radius + 70;
    }

    draw(ctx, t) {
        if (!this.time) {
            this.time = t;
        }
        const now = t - this.time;
        if (now > this.fpsTime) {
            this.time = t;
            this.updatePoints();
        }

        ctx.fillStyle = "#F2EDD0";
        ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        //원을 그리는 대신 업데이트된 좌표들을 선으로 연결
        let pos = this.pos[0];
        ctx.moveTo(pos.x + this.x, pos.y + this.y);
        for (let i = 1; i < this.total; i++) {
            const pos = this.pos[i];
            ctx.lineTo(pos.x + this.x, pos.y + this.y);
        }
        ctx.fill();
    }

    updatePoints() {
        for (let i = 1; i < this.total; i++) {
            const pos = this.originPos[i];
            this.pos[i] = {
                x: pos.x + this.ranInt(3),
                y: pos.y + this.ranInt(3),
            };
        }
    }
    ranInt(max) {
        return Math.random() * max;
    }
    //원 위의 좌표
    //x = cos(좌표까지의 수평각)*반지름
    getCirclePoint(radius, t) {
        const theta = Math.PI * 2 * t;

        return {
            x: Math.cos(theta) * radius,
            y: Math.sin(theta) * radius,
        };
    }
}
