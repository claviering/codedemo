// 品类转 id
const axios = require('axios');

async function queryProperty(params) {
  return await axios.post(itemCenterServer + '/item/property/query', params);
};

async function queryPropertyValue(params) {
  return await axios.post(itemCenterServer + '/item/property/value/query', params);
};

async function getYearAndProject(inputParams) {
  let datas = await queryProperty({}); // 获取所有集团属性项列表
  if(datas.code == 0) {
      let yearProjectIds = null;
      let yearProjectList = [];
      let respList = [];
      let result = {
          project:[],
          season:[],
          year:[]
      };

      // 1、获取‘年份/波段/季节’属性值的列表
      yearProjectIds = _.filter(datas.data, item => {
          return item.enName == 'project' || item.enName == 'year' || item.enName == 'season';
      }).map(item => {
          return {'id': item.id, 'enName': item.enName}; // 1.1 获取年份波段季节属性的ids数组
      });
      let params = {
          matchByPropertyId : _.map(yearProjectIds, 'id'),
          matchByBrandId :inputParams.matchByBrandId || new Array(constants.BRANDCODE_TO_ID[inputParams.sessionUser.userInfo.brandId])
      };

      _.each(params.matchByBrandId,brand => {
         let tmp = {
             matchByPropertyId:params.matchByPropertyId,
             matchByBrandId:[brand]
         };
         respList.push(queryPropertyValue(tmp));
      });

      // 1.2 根据属性ids，获取年份波段季节属性列表
      const respGroup = await Promise.all(respList);


      _.each(respGroup,(resp,respIndex) => {
          var newYearProjectList = resp.data;

          let propertyIdObj = _.groupBy(yearProjectIds, 'id');
          _.each(newYearProjectList, item => {
              item.enName = propertyIdObj[item.propertyId][0].enName;
              item.brandId = inputParams.matchByBrandId && inputParams.matchByBrandId[respIndex] ? inputParams.matchByBrandId[respIndex] : constants.BRANDCODE_TO_ID[inputParams.sessionUser.userInfo.brandId] ;
          });

          newYearProjectList = _.orderBy(newYearProjectList, 'value');
          newYearProjectList = _.groupBy(newYearProjectList, 'enName');
          if(newYearProjectList && newYearProjectList.year){
              newYearProjectList.year = _.orderBy(newYearProjectList.year, 'value','desc');
          }

          _.each(newYearProjectList,(item,name) => {
             if(name === 'year'){
                 result.year = result.year.concat(item);
             }else if(name === 'project'){
                 result.project = result.project.concat(item);
             }else if(name === 'season'){
                 result.season = result.season.concat(item);
             }
          });
      });

      return result;

  }else{
      return null;
  }
};