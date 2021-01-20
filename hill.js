export class Hill {
    constructor(color, speed, total) {
        //색상, 스피드, 점 개수
        (this.color = color), (this.speed = speed), (this.total = total);
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.points = [];
        //전체 넓이(stageWidth)를 전체 점의 개수(total)로 나누지 않고 개수 -2 로 나누어
        //gap을 더 넓게 벌려 전체 넓이의 바깥쪽부터 언덕이 그려지도록 함
        //양이 자연스럽게 화면 밖에서 걸어오도록 하기 위함
        this.gap = Math.ceil(this.stageWidth / (this.total - 2));
        //점의 배열 생성
        for (let i = 0; i < this.total; i++) {
            this.points[i] = {
                //좌표의 x 값은 gap * i 만큼
                x: i * this.gap,
                //좌표의 y값은 getY 함수를 만들어 랜덤으로 지정
                y: this.getY(),
            };
        }
    }

    draw(ctx) {
        //색상은 constructor의 color argument
        ctx.fillStyle = this.color;
        //하위 경로를 지우고 새 경로를 시작함
        ctx.beginPath();
        //포인트 배열 가져옴
        let cur = this.points[0];
        //이전 포인트배열
        let prev = cur;

        let dots = [];
        //x좌표를 speed 값 만큼 + 시켜주어 오른쪽으로 이동하게 만든다
        cur.x += this.speed;
        //화면에서 일정 영역 이상 나가면 배열에서 제외시켜 배열 길이를 관리
        if (cur.x > -this.gap) {
            //.unshift() = 배열의 시작부분에 하나 이상의 요소를 추가하고 배열의 새 길이를 반환
            this.points.unshift({
                x: -(this.gap * 2),
                y: this.getY(),
            });
        } else if (cur.x > this.stageWidth + this.gap) {
            this.points.splice(-1);
        }
        //시작점 설정
        ctx.moveTo(cur.x, cur.y);

        let prevCx = cur.x;
        let prevCy = cur.y;

        for (let i = 1; i < this.points.length; i++) {
            cur = this.points[i];
            //x좌표를 speed 값 만큼 + 시켜주어 오른쪽으로 이동하게 만든다
            cur.x += this.speed;
            //곡선이 향할 포인트 설정
            //이전 점과 현재 점을 더하고 2로 나눔 = 두 점의 중심이 곡선이 향할 포인트
            const cx = (prev.x + cur.x) / 2;
            const cy = (prev.y + cur.y) / 2;
            //(향하는 점의 x, 향하는 점의 y, 끝x, 끝y)
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
            //양의 위치를 정하기 위해 dots 배열에 좌표를 넣어줌
            dots.push({
                x1: prevCx,
                y1: prevCy,
                x2: prev.x,
                y2: prev.y,
                x3: cx,
                y3: cy,
            });

            prev = cur;
            prevCx = cx;
            prevCy = cy;
        }
        //언덕 그리기
        ctx.lineTo(prev.x, prev.y);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();
        //dots 배열 return
        return dots;
    }

    getY() {
        //전체 높이(stageHeight)를 8로 나눈 값
        const min = this.stageHeight / 8;
        //전체높이 * 7/8
        const max = this.stageHeight - min;
        //전체 높이 7/8에 랜덤한 0~1 사이의 수를 곱하여 전체 높이 1/8에 더한 값을 return함
        //결과적으로 전체 높이 1/8 부분 위와 전체 높이 사이로 랜덤한 Y값이 return되는 셈
        return min + Math.random() * max;
    }
}
