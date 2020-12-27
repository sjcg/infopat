layui.use(["laytpl", "patBasicInfo", "picture"], function () {
  var $ = layui.jquery,
    laytpl = layui.laytpl,
    picture = layui.picture,
    patBasicInfo = layui.patBasicInfo;
  //动态加载CSS
  layui.link("./page/PatentEvaluationReport/index.css");
  //从session里面获取模拟数据
  var data = layui.sessionData("session").basicInfo;
  var allInfo = layui.sessionData("session").allInfo;
  var scxxData = allInfo["审查信息"];
  //获取模板 入参为false 返回暂无数据，如果有数据的话则正常返回模板
  let tpl = patBasicInfo.getTpl(data);
  //渲染模板以及数据到dom元素里去
  var view = document.getElementById("basicInfoView");

  laytpl(tpl).render(data, function (html) {
    view.innerHTML = html;
  });

  function getImgUrl(url, cb) {
    $(".detailInfo").loding("start");
    $.ajax({
      type: "GET",
      url: url,
      success: function (result) {
        //返回成功进行响应操作
        if (result.data) {
          cb && cb(result.data);
        }
      },

      complete: function () {
        $(".detailInfo").loding("stop");
      },
    });
  }
  //如果沒有數據直接顯示暫無數據
  if (!scxxData) {
    $(".detailInfo").html(`<div class="table-container-common table-item" >
      <div class="table-title-common table-title">专利权评价报告</div>
      <div class="no-data-onepage">
        <img src="./images/nodata.png" alt="_" />
        <div>暂无数据</div>
      </div>
    </div>`);
    return;
  }

  //渲染专利评价报告
  let pjbgData = scxxData["评价报告"];
  let scyjData = [];
  if (pjbgData) {
    const pjbgValue = Object.values(pjbgData);
    //请求查询
    if (pjbgValue && pjbgValue[0] && pjbgValue[0] != "") {
      getImgUrl(pjbgValue[0], function (imgs) {
        console.log(imgs);
        if (imgs && imgs.length > 0) {
          $("#common-container-picture").show();
          $(".nodataInfo").hide();
          picture.init("#common-container-picture", imgs, { mask: false });
        } else {
          $("#common-container-picture").hide();
          $(".nodataInfo").show();
        }
      });
      return;
    }
  }
  $(".detailInfo").html(`<div class="table-container-common table-item" >
  <div class="table-title-common table-title">专利权评价报告</div>
  <div class="no-data-onepage">
    <img src="./images/nodata.png" alt="_" />
    <div>暂无数据</div>
  </div>
</div>`);

  // let imgs = [
  //   "../../images/picture/00001.png",
  //   "../../images/picture/00002.png",
  //   "../../images/picture/00003.png",
  //   "../../images/picture/00004.png",
  //   "../../images/picture/00005.png",
  // ];

  //loading框
  // $(".detailInfo").loding("start");
  // setTimeout(() => {
  //   $(".detailInfo").loding("stop");
  // }, 1000);
});
