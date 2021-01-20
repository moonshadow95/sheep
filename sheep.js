export class Sheep {
    constructor(img, stageWidth) {
        this.img = img;
        //Frame 정의
        //그린 양이 8프레임 = 전체 프레임
        this.totalFrame = 8;
        this.curFrame = 0;

        this.imgWidth = 360;
        this.imgHeight = 300;

        this.sheepWidth = 180;
        this.sheepHeight = 150;

        this.sheepWidthHalf = this.sheepWidth / 2;
        //양을 화면 바깥에 생기게
        this.x = stageWidth + this.sheepWidth;
        this.y = 0;
        this.speed = Math.random() * 1.5 + 0.3;

        this.fps = 24;
        this.fpsTime = 1000 / this.fps;
    }

    draw(ctx, t, dots) {
        if (!this.time) {
            this.time = t;
        }

        const now = t - this.time;
        if (now > this.fpsTime) {
            this.time = t;
            this.curFrame += 1;
            if (this.curFrame == this.totalFrame) {
                this.curFrame = 0;
            }
        }
        this.animate(ctx, dots);
    }

    animate(ctx, dots) {
        this.x -= this.speed;
        const closest = this.getY(this.x, dots);
        this.y = closest.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(closest.rotation);
        ctx.drawImage(
            this.img,
            this.imgWidth * this.curFrame,
            0,
            this.imgWidth,
            this.imgHeight,
            //하단 중앙을 중심점으로 하기 위해
            -this.sheepWidthHalf,
            -this.sheepHeight + 20,
            this.sheepWidth,
            this.sheepHeight
        );
        ctx.restore();
    }

    getY(x, dots) {
        for (let i = 1; i < dots.length; i++) {
            if (x >= dots[i].x1 && x <= dots[i].x3) {
                return this.getY2(x, dots[i]);
            }
        }
        return {
            y: 0,
            rotation: 0,
        };
    }
    getY2(x, dot) {
        const total = 200;
        let pt = this.getPointOnQuad(
            dot.x1,
            dot.y1,
            dot.x2,
            dot.y2,
            dot.x3,
            dot.y3,
            0
        );
        let prevX = pt.x;
        for (let i = 1; i < total; i++) {
            const t = i / total;
            pt = this.getPointOnQuad(
                dot.x1,
                dot.y1,
                dot.x2,
                dot.y2,
                dot.x3,
                dot.y3,
                t
            );

            if (x >= prevX && x <= pt.x) {
                return pt;
            }
            prevX = pt.x;
        }
        return pt;
    }
    //곡선위의 좌표 찾는 함수 (베지어 곡선 위키피디아 참조)
    getQuadValue(p0, p1, p2, t) {
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }

    getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
        const tx = this.quadTangent(x1, x2, x3, t);
        const ty = this.quadTangent(y1, y2, y3, t);
        //수직의 각도를 구하는 공식이기 때문에 90도를 더해서 수평의 각도로 바꿈
        //atan2(arc tangent2)의 값이 라디안이기 때문에 90도를 라디안으로 변경해서 더해줌
        const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;
        return {
            x: this.getQuadValue(x1, x2, x3, t),
            y: this.getQuadValue(y1, y2, y3, t),
            rotation: rotation,
        };
    }
    //곡선위 좌표의 수직 기울기를 구하는 공식(StackOverFllow)
    quadTangent(a, b, c, t) {
        return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
    }
}
