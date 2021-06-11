/**
 * 根据 keu vaule 两个字段生成 Map
 * @param {Function} api egg 的 service
 * @param {Object} params 请求参数
 * @param {String} key 接口查询回来根据 key 生成 map
 * @param {String} value 接口查询回来根据 生成 map 的 value
 * @returns {Object} map
 */

 async function targetMap(api, params, key, value) {
  let response = await api(params)
  let map = Object.create(null)
  // page 接口
  if (response && response.data && response.data.records && response.data.records.length) {
    response.data.records.forEach(item => {
      let mapKey = _.get(item, key);
      let mapVal = _.get(item, value);
      map[mapKey] = (!mapVal || mapVal === 'undefined') ? '' : mapVal;
    })
    // list 接口
  } else if (response && response.data && response.data.length) {
    response.data.forEach(item => {
      let mapKey = _.get(item, key);
      let mapVal = _.get(item, value);
      map[mapKey] = (!mapVal || mapVal === 'undefined') ? '' : mapVal;
    })
  }
  return map
}

/**
 * 给数组对象添加字段
 * @param {Array} list 数据列表
 * @param {String} from 根据list中的那个字段 join 数据
 * @param {Object} map key -> value 映射
 * @returns {Array<Object>} list
 */
function addListObjectField(list, map, from, newFieldName) {
  list.forEach(item => {
    let mapKey = item[from];
    let fidldValue = map[mapKey]
    item[newFieldName] = fidldValue || ''
    return item;
  })
  return list;
}