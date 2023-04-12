// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UpdateLinePointBox extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let phyBox = this.node.getComponent(cc.PhysicsBoxCollider)
        phyBox.size.width = this.node.width;
        phyBox.size.height = this.node.height;
        phyBox.apply()
    }

    update(dt) {

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "4") {
        }
    }
}
