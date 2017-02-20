require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

import ImgFigure from './ImgFigure'
import ControllerUnit from './ControllerUnit'

// let yeomanImage = require('../images/yeoman.png');

let imageDatas = require('../data/imageDatas.json')

imageDatas = imageDatas.map(imageData => Object.assign({}, imageData, {
  imageURL: require('../images/' + imageData.fileName)
}))

/*class AppComponent extends React.Component {
 render() {
 return (
 // <div className="index">
 //   <img src={yeomanImage} alt="Yeoman Generator" />
 //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
 // </div>
 <section className="stage">
 <section className="img-sec">
 
 </section>
 <nav className="controller-nav">
 
 </nav>
 </section>
 );
 }
 }*/

/*AppComponent.defaultProps = {
 };*/

let AppComponent = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],  // 水平方向的取值范围
      rightSecX: [0, 0],
      y: [0, 0]  // 垂直方向的水平范围
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },
  
  /**
   * 翻转图片
   * @param index 当前被执行inverse操作的图片索引
   * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
   * */
  inverse: function (index) {
    return function () {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
      this.setState({
        imgsArrangeArr
      })
    }.bind(this)
  },
  
  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   * */
  rearrange: function (centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取，放在上侧区域
      topImgSpliceIndex = 0,
      
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    console.info(imgsArrangeArr)
    
    imgsArrangeCenterArr[0].isCenter = true
    
    // 首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;
    
    // 居中的 centerIndex 的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;
    
    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * imgsArrangeArr.length - topImgNum);
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    
    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom()
      }
    })
    
    // 布局位于左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;
      // 前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom()
      }
    }
    
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, ...imgsArrangeTopArr)
    }
    
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])
    
    this.setState({
      imgsArrangeArr
    })
  },
  /**
   * 利用 rearrange 函数，居中对应 index 的图片
   * @param index, 需要被居中的图片对应的索引
   * @return {Function}
   * */
  center: function (index) {
    return function () {
      this.rearrange(index)
    }.bind(this)
  },
  getInitialState: function () {
    return {
      imgsArrangeArr: [
        // {
        //   pos: { // 位置信息
        //     left: '0',
        //     top: '0'
        //   },
        //   rotate: 0 // 旋转角度
        //   isInverse: false // 图片正反面
        //   isCenter: false // 图片是否居中
        // }
      ]
    }
  },
  componentDidMount: function () {
    // 组件加载以后为每张图片计算其位置的范围
    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);
    
    // 拿到一个imagefigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);
    
    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    
    // 计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgW;
    this.Constant.hPosRange.y[1] = stageH - halfImgH
    
    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    
    this.rearrange(0);
  },
  render: function () {
    let controllerUnits = [], imgFigures = [];
    imageDatas.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                 center={this.center(index)}/>)
      controllerUnits.push(<ControllerUnit key={index} inverse={this.inverse(index)} center={this.center(index)}
                                           arrange={this.state.imgsArrangeArr[index]}/>)
    }.bind(this))
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }
})

function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

// 获取 -30 到 30 之间的任意值
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

export default AppComponent;
