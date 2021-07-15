export class PonlygonUtils {
    /**
     * 两个向量的点积
     * @param a 
     * @param b 
     * @param c 
     */
    public static dotV2(v1: { x: number, y: number }, v2: { x: number, y: number }): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    /**
     * 计算polyArr在轴线axis上的投影,polyArr是一系列点坐标的集合,数组表示
     * @param axis 
     * @param polyArr 
     * @returns 
     */
    public static calcProj(axis: { x: number, y: number }, polyArr: Array<number>): Array<number> {
        let v = { "x": polyArr[0], "y": polyArr[1] };
        let d, min, max;
        min = max = this.dotV2(axis, v);//计算投影轴与第一个坐标点的点积
        for (let i = 2; i < polyArr.length - 1; i += 2) {
            v.x = polyArr[i];
            v.y = polyArr[i + 1];
            d = this.dotV2(axis, v);//计算v到投影轴的距离,遍历出最小和最大区间
            min = (d < min) ? d : min;
            max = (d > max) ? d : max;
        }
        return [min, max];
    }

    /**
     * 计算同一个轴上线段的距离s1(min1,max1),s2(min2,max2),如果距离小于0则表示两线段有相交;
     * @param min1 
     * @param max1 
     * @param min2 
     * @param max2 
     * @returns 
     */
    public static segDist(min1: number, max1: number, min2: number, max2: number): number {
        if (min1 < min2) {
            return min2 - max1;
        }
        else {
            return min1 - max2;
        }
    }

    /**
     * 判断两个多边形是否相交碰撞,p1,p2用于保存多边形点的数组
     * @param p1 
     * @param p2 
     * @returns 
     */
    public static isCollide(p1: Array<number>, p2: Array<number>): boolean {
        if (p1.length < 6 || p2.length < 6) {
            return false;
        }
        //定义法向量
        let e = { "x": 0, "y": 0 };
        let p = p1, idx = 0, len1 = p1.length, len2 = p2.length, px, py;//p缓存形状p1的数据
        for (let i = 0, len = len1 + len2; i < len - 1; i += 2)//遍历所有坐标点，i+=2代表xy轴两个坐标点
        {
            idx = i;
            //计算两个多边形每条边
            if (i > len1) {//当p1遍历完毕后，p缓存形状p2的数据,从新遍历
                p = p2;
                idx = (i - len1);//len2
            }
            if (i === p.length - 2) {//p包含的点数据组成的最后一个坐标点
                px = p[0] - p[idx];//首尾的x轴相连
                py = p[1] - p[idx + 1];//首尾的y轴相连
            } else {
                px = p[idx + 2] - p[idx];//递增的x轴相连
                py = p[idx + 3] - p[idx + 1];//递减的y轴相连
            }
            //得到边的法向量【垂直相交】，即投影轴
            e.x = -py;
            e.y = px;
            //计算两个多边形在法向量上的投影
            let pp1 = this.calcProj(e, p1);//涵盖到投影轴的最小值与最大值
            let pp2 = this.calcProj(e, p2);
            //计算两个线段在法向量上距离，如果大于0则可以退出，表示无相交
            if (this.segDist(pp1[0], pp1[1], pp2[0], pp2[1]) > 0) {
                return false;
            }
        }
        return true;
    }
}