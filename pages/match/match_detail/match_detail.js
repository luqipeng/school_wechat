const uploader = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp();

Page({
  data: {
    matchs: [],
    id:''
  },
  onLoad: function (option) {
    let objId = option.id;
    this.setData({
      id:objId
    })

    this.getList();
  },
  onShow() {
  },

  /**
   * 获取贴子列表
   */
  getList: function () {
    let _this = this;
    let id = this.data.id;
    http.get(`/match_love/${id}`, {}, res => {
      let matchs = _this.data.matchs;
      matchs.push(res.data.data);
      _this.setData({
        matchs: matchs
      });
    });
  },
  /**
   * 关注
   */
  follow: function (e) {
    let _this = this;
    let objId = e.target.dataset.obj;
    http.post('/follow', {
      obj_id: objId,
      obj_type: 3
    }, function (res) {
      let follow = res.data.data;
      let matchs = _this.data.matchs;
      let newMatchs = matchs.map(item => {
        if (item.id == follow.obj_id) {
          item.follow = true;
        }
        return item;
      });

      _this.setData({
        matchs: newMatchs
      });
    });
  },
  /**
   * 取消关注
   */
  cancelFolllow: function (e) {
    let _this = this;
    let objId = e.target.dataset.obj;
    http.put(`/cancel/${objId}/follow/3`, {}, function (res) {
      let follow = res.data.data;
      let matchs = _this.data.matchs;
      let newMatchs = matchs.map(item => {
        if (item.id == objId) {
          item.follow = false;
        }
        return item;
      });
      _this.setData({
        matchs: newMatchs
      });
    });

  },

  /**
   * 删除帖子
   */
  delete: function (e) {
    let objId = e.currentTarget.dataset.obj;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该匹配？',
      success: function (res) {
        if (res.confirm) {
          http.httpDelete(`/delete/${objId}/match_love`, {}, res => {
            if (res.data.data == 1) {
              let newMatchs = _this.data.matchs.filter((item, index) => {
                if (item.id != objId) {
                  return item;
                }
              });
              _this.setData({
                matchs: newMatchs
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 点赞
   */
  praise: function (event) {
    let objId = event.currentTarget.dataset.obj;
    let objType = 3;
    let _this = this;
    http.post(`/praise`, { obj_id: objId, obj_type: objType }, res => {
      let matchList = _this.data.matchs;
      let newMatchs = matchList.map(item => {
        if (objId == item.id) {
          item.praise_number += 1;
        }
        return item;
      });
      //重新赋值，更新数据列表
      _this.setData({
        matchs: newMatchs
      });
    });
  },
})