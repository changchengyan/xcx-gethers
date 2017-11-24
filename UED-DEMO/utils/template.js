// pages/template/template.js
var app = getApp();
function isCanView(that, uid, match_sales_id, match_sales_name,callback,callback2) {
	//判断该资源是否需要付费
	if(that.data.match_sales_name == "seed") {
		//是商品
		app.codeBook.getCodeBookSeedCanView(
			uid,
			match_sales_id,
			match_sales_name,
			function(res) {
				var canView = res.data.canView;
				that.setData({ payLoading: false });
				if(canView) {
					that.setData({ canView: true });
				} else {
					that.setData({ canView: false });
				}
				if(callback) {
					callback();
				}
			}
		)
	} else {
		that.setData({ payLoading: false });
		that.setData({ canView: true });
		if(callback2) {
			callback2();
		}
		return true;
	}
}
module.exports.isCanView = isCanView;