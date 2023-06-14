const data = require("../coc.json");

/**
 * 计算从一本升级到 level 需要的花费
 * @param {number} level 大本营等级
 */
function addLevel(level) {
  let dataList = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let dataMap = {
      title: item.title,
      children: [],
    };
    for (let j = 0; j < item.children.length; j++) {
      const child = item.children[j];
      // 东西升级到 level 所需要的资源，时间
      let buildingNumber =
        (child.buildingNumber && child.buildingNumber[level]) || 1;
      let childMap = {
        name: child.name,
        level,
        gold: 0,
        water: 0,
        oil: 0,
        time: 0, // 单位秒
      };
      for (let k = 0; k < child.data.length; k++) {
        const d = child.data[k];
        let curLevel = d["所需大本营等级"];
        if (curLevel <= level) {
          let gold = d["升级花费金币"];
          let water = d["升级花费圣水"];
          let oil = d["升级花费黑油"];
          let time = d["升级时间"];

          childMap.gold += isNaN(gold) ? 0 : gold;
          childMap.water += isNaN(water) ? 0 : water;
          childMap.oil += isNaN(oil) ? 0 : oil;
          childMap.time += isNaN(time) ? 0 : time;
        }
      }
      childMap.gold = childMap.gold * buildingNumber;
      childMap.water = childMap.water * buildingNumber;
      childMap.oil = childMap.oil * buildingNumber;

      dataMap.children.push(childMap);
    }
    dataList.push(dataMap);
  }
  return dataList;
}

function sum() {
  let map = {};
  for (let i = 1; i <= 15; i++) {
    let list = addLevel(i);
    map[i] = list;
  }
  // console.log("map", map);
  calcLevelSum(map);
}

// 计算当前升级等级所需要的时间
function calcLevelSum(map) {
  let totallist = [];
  for (let i = 15; i >= 1; i--) {
    let list = map[i];
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      const child = list[i];
      for (let j = 0; j < child.children.length; j++) {
        const item = child.children[j];
        // console.log("item.name", item.time / 60 / 60);
        total += item.time / 60 / 60 / 24; // 天
      }
    }
    totallist.unshift(total);
    console.log(`1农: 从1本升级到${i}本, 需要${total}天`);
  }
  console.log("");
  for (let i = 0; i < totallist.length - 1; i++) {
    console.log(
      `1农: 从${i + 1}本升级到${i + 2}本, 需要${
        totallist[i + 1] - totallist[i]
      }天`
    );
  }
  console.log("");
  for (let i = 0; i < totallist.length - 1; i++) {
    console.log(
      `5农: 从${i + 1}本升级到${i + 2}本, 需要${
        totallist[i + 1] / 5 - totallist[i] / 5
      }天`
    );
  }
}

sum();
