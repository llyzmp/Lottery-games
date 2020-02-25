var lottery = {
    //添加一把锁
    flag: false,
    index:0,//被选中展示元素的元素索引
    time:300,
    timer:null,
    // 初始化
    init: function(options){
        //调用初始化数据函数
        this.initData(options)
        //调用渲染函数
        this.render();
        //调用事件处理函数
        this.handle()
    },
    // 初始数据
    initData: function(options){
        // console.log(options)
        // 把el等数据挂载到this上
        this.el = options.el;
        this.row = options.row || 4 //抽奖区域行数
        this.col = options.col || 4 //抽奖区域列数
        this.width = options.width || 100 //每一个抽奖子元素宽度,默认值100
        this.height = options.height || 100 //每一个子元素高度,默认100
        this.spacing = options.spacing || 5 //每个元素空隙距离
        //抽奖区域的总宽度和总高度
        this.totalWidth = this.width * this.col + this.spacing * (this.col - 1);
        this.totalHeight = this.height * this.row + this.spacing * (this.row -1);
        //根据行和列来生成多少个div元素
        this.childLength = options.row * options.col - (options.row - 2)*(options.col - 2)
        //抽奖子元素位置信息数组
        this.domPosArr = this.getPosition(this.childLength);
        // 把数组中的元素挂载到this上
        this.lottery = options.lottery;
    },
    //子元素位置信息函数,返回一个数组
    getPosition: function(childLength){
        //得到每一个抽奖子元素的位置信息
        var arr = [];//存放位置信息的数组
        //定义临界值  根据4*4抽奖方格找规律,四个临界值
        var criticalVal1 = 0;
        var criticalVal2 = this.col;
        var criticalVal3 = this.col + this.row - 1;
        var criticalVal4 = this.col*2 + this.row -2
        //循环把每个元素的位置信息添加到数组中
        for(var i = 0 ; i < childLength; i++){
            //第一行的几个元素,离顶部距离为0,离左边以此增加,带上空隙
           if(i >= criticalVal1 && i < criticalVal2){
            arr[i] ={
                top:0 + 'px',
                left:i*(this.width + this.spacing) + 'px',
            }
           }
           //右边竖列的子元素距离右边距离为0,距离顶部距离是依次增加
           else if (i >= criticalVal2 && i < criticalVal3){
            arr[i] ={
                right: 0 + 'px',
                top: (i-criticalVal2+1) * (this.height + this.spacing) + 'px'
            }
           }
           //底部的子元素,距离底部距离为0,距离右边距离是依次增加
           else if(i >= criticalVal3 && i < criticalVal4) {
               arr[i] = {
                   bottom: 0 + 'px',
                   right: (i-criticalVal3+1) * (this.width + this.spacing) + 'px'
               }
           }
           //左边最后一列,距离最左边距离为0,距离底部距离以此增加
           else{
            arr[i] = {
                left: 0 + 'px',
                bottom :(i-criticalVal4 + 1) * (this.height + this.spacing) + 'px'
            }
           }
        }
        //把数组return出去
        return arr;
    },
    //渲染
    render: function() {
        for(var i = 0 ; i < this.childLength ; i++){
            //循环抽奖子元素的个数,每次循环都创建一个div,将创建出来的div添加到父元素中
            var posInfo = this.domPosArr[i];
            //创建生成div元素
            var oDiv = document.createElement('div')
            oDiv.setAttribute('class','lottery-item'); //给div元素添加一个类名,用于书写样式
            //把每一个元素的位置距离改变
            if(posInfo.top) {oDiv.style.top = posInfo.top}
            if(posInfo.right) {oDiv.style.right = posInfo.right}
            if(posInfo.bottom) {oDiv.style.bottom = posInfo.bottom}
            if(posInfo.left) {oDiv.style.left = posInfo.left}

            oDiv.innerText = i; //在div中添加文本数字
            //添加到el元素中
            this.el.appendChild(oDiv)
        }
        //生成抽奖按钮,添加到父元素中
        var oDiv = document.createElement('div');
        //添加类名,用于书写样式
        oDiv.setAttribute('class','lottery-btn');
        oDiv.innerText = '点我抽奖';
        oDiv.style.lineHeight = this.totalHeight * 0.2 + 'px';
        this.el.appendChild(oDiv);

        //渲染出抽奖区域总宽度和总高度
        this.el.style.width = this.totalWidth + 'px';
        this.el.style.height = this.totalHeight + 'px';
        //添加一个类名
        this.el.classList.add('lottery')
    },

    //监听事件函数
    handle: function(){
        //保存一下this
        var that = this;
        //利用事件委托注册点击事件
        this.el.onclick = function(e) {
            //点击的那个元素
            var dom = e.target;
            //判断点击的元素中包含点我抽奖的按钮
            var isBtn= dom.classList.contains('lottery-btn');
            if(isBtn && !that.flag){
                //如果点击了抽奖按钮,并且没有抽奖时,执行抽奖函数
                that.startLottery();
            }
        }
    },
    //抽奖函数
    startLottery:function(){
        // 开始抽奖
        this.flag = true; // 将flag置为true,代表正在抽奖,重复点击抽奖按钮无效
        //找到第一个元素,将其作为显示元素
        var onDom = this.el.getElementsByClassName('lottery-item')[this.index];
        //选中的那个元素,添加一个类名,设置其样式
        onDom.classList.add('on');
        //运行抽奖,由于runner函数在定时器中执行,定时器内部this指向window,所以重新绑定runner函数的this指向
        this.timer = setTimeout(this.runner.bind(this),this.time);
    },
    //运行抽奖函数
    runner:function(){
        //运行抽奖之前,先清空定时器
        clearTimeout(this.timer);
        //获取index索引
        var index = Math.floor(Math.random()*this.childLength);
        while(index === this.index){
            //获取到index和this.index重复时,重新获取一次
            var index = Math.floor(Math.random()*this.childLength);    
        }
        this.index = index; // 将获取到的索引赋值给this.index
        //找到展示的抽奖元素,即是on元素
        var onDom = this.el.getElementsByClassName('on')[0];
        //移除on元素上的on class
        onDom.classList.remove('on');
        //找到第index个lottery-item
        onDom = this.el.getElementsByClassName('lottery-item')[this.index];
        //在该dom的class列表上添加on
        onDom.classList.add('on');
        //每一次时间间隔10毫秒
        this.time -= 15;
        //当时间小于15毫秒时,抽奖结束
        if(this.time < 15) {
            //调用结束函数
            this.end();
            return;
        }
        // 由于runner函数在定时器中执行，其内部的this指向为window，所以重新绑定一下runner函数的this指向
        this.timer = setTimeout(this.runner.bind(this), this.time);
    },
    //抽奖结束函数
    end: function(){
        var self = this;
        setTimeout(function () {
          console.log(self.index)
          alert(self.lottery[self.index]);
          self.resetting();
        }, 0)
    },
    //重置数据函数
    resetting: function() {
        this.flag = false;
        this.index = 0 ;
        this.time = 300;
        //移除第一个点亮的元素
        this.el.getElementsByClassName('on')[0].classList.remove('on')
    }





}