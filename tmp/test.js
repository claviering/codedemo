let res = {
  items: []
}
let res1 = {
  items: [
    {
      ecStatus: 1,
    },
    {
      ecStatus: 1,
    }
  ]
}
let res2 = {
  items: [
    {
      ecStatus: -1,
    },
    {
      ecStatus: -1,
    }
  ]
}
let res3 = {
  items: [
    {
      ecStatus: 1,
    },
    {
      ecStatus: -1,
    }
  ]
}
let res4 = {
  items: [
    {
      ecStatus: -1,
    },
    {
      ecStatus: 1,
    }
  ]
}
let res5 = {
  items: [
    {
      ecStatus: -1,
    }
  ]
}
let res6 = {
  items: [
    {
      ecStatus: 1,
    }
  ]
}
function test(res) {
  if (!res || !res.items || !res.items.length) {
    return '查询不到此会员'
  } else if (res.items.length === 1 && res.items[0].ecStatus == -1) {
    return '该会员状态已作废'
  } else if (res.items.length > 1) {
    let vaildList = res.items.filter(item => item.ecStatus == 1);
    if (vaildList && vaildList.length > 1) {
      return '该手机存在多个会员身份，请先作废多余的会员卡'
    } else if (vaildList && !vaildList.length) {
      return '该会员状态已作废'
    }
  }
  res.items = res.items.filter(item => item.ecStatus == 1)
  console.log(res.items);
  return "OK"
}
console.log("查询不到此会员", test(res));
console.log("该手机存在多个会员身份，请先作废多余的会员卡", test(res1));
console.log("该会员状态已作废", test(res2));
console.log("OK", test(res3));
console.log("OK", test(res4));
console.log("该会员状态已作废", test(res5));
console.log("OK", test(res6));