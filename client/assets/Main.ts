// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Prefab)
    public line_point_prefab: cc.Prefab = null;

    private line_point: cc.Vec2[] = [];

    private ctx: cc.Graphics = null;

    private firstNode: cc.Node = null;

    private lastNode: cc.Node = null;

    onLoad() {
        //设置物理引擎
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.enabledAccumulator = true;
        manager.gravity = cc.v2(0, 40);
        //绘制物理信息
        // manager.debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;

        let gNode = new cc.Node("gNode");
        this.ctx = gNode.addComponent(cc.Graphics);
        this.ctx.lineWidth = 10
        this.ctx.strokeColor = cc.color().fromHEX("#FFFFFF")
        this.node.addChild(gNode)

        this.onTouch();
    }

    start() {

    }

    onTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_end, this);
    }

    offTouch() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touch_end, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touch_end, this);
    }

    touch_start(event) {
        this.line_point = [];
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.line_point.push(cc.v2(pos.x, pos.y));
        
        this.ctx.moveTo(pos.x, pos.y);
        // this.ctx.stroke();
    }

    touch_move(event) {
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.line_point.push(cc.v2(pos.x, pos.y));
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke()
    }

    touch_end(event) {
        this.offTouch();
        this.ctx.clear();

        let polys = this.line_point;
        let pointNodes: cc.Node[] = [];
        for (var i = 0; i < polys.length - 1; i++) {
            let posBegin = polys[i];
            let posEnd = polys[i + 1];
            let linelen = posBegin.sub(posEnd).mag();
            console.log("linelen:", linelen);
            let temp = cc.instantiate(this.line_point_prefab);
            let genCount = Math.ceil(linelen / temp.width);
            console.log("genCount:", genCount);

            for (let index = 0; index < genCount; index++) {
                let pointNode = cc.instantiate(this.line_point_prefab);
                this.node.addChild(pointNode);
                pointNode.setPosition(cc.v2(posBegin.x + (index * temp.width), posBegin.y));
                // pointNode.width = linelen;
                // pointNode.angle = this.getAngle(posBegin, posEnd);
                pointNodes.push(pointNode);
            }
            temp.destroy();

            this.ctx.moveTo(posBegin.x, posBegin.y);
            this.ctx.lineTo(posEnd.x, posEnd.y);
            // this.ctx.stroke();
        }

        pointNodes[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        // pointNodes[0].getComponent(cc.RigidBody).linearVelocity = cc.v2(0,30);

        for (let index = 0; index < pointNodes.length; index++) {
            if (index !== pointNodes.length - 1) {

                const a = pointNodes[index];
                const b = pointNodes[index + 1];
                let rope = a.addComponent(cc.WeldJoint);
                rope.connectedBody = b.getComponent(cc.RigidBody);
                // rope.maxLength = 1;
                rope.collideConnected = true
                // rope.distance=1;

                // b.getComponent(cc.RigidBody).gravityScale = 0.5;

                if (index > pointNodes.length / 2) {
                    // b.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 100);
                    // b.getComponent(cc.RigidBody).linearVelocity = polys[0];
                    // this.schedule(()=>{
                    //     b.y+=5
                    // },0.5)

                }
            }
        }

        // let lastRig = pointNodes[pointNodes.length - 1].getComponent(cc.RigidBody);
        // lastRig.linearVelocity = cc.v2(0,100);

        this.firstNode = pointNodes[0];
        this.lastNode = pointNodes[pointNodes.length - 1];
    }

    update(dt) {
        if (this.firstNode && this.lastNode) {
            this.lastNode.x += ((this.firstNode.x * 2 - this.lastNode.x) * dt * 20);
            this.lastNode.y += ((this.firstNode.y * 2 - this.lastNode.y) * dt * 20);

            // // this.firstNode.x -= 8
            // this.firstNode.y += 8
        }
    }

    getAngle(start, end) {
        //计算出朝向
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        var dir = cc.v2(dx, dy);

        //根据朝向计算出夹角弧度
        var angle = dir.signAngle(cc.v2(1, 0));

        //将弧度转换为欧拉角
        var degree = angle / Math.PI * 180;

        return -degree
    }

}
