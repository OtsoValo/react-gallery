import React from 'react'

let ImgFigure = React.createClass({
  /**
   * imgFigure 的点击处理函数
   * */
  handleClick: function(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center()
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render: function() {
    let styleObj = {}
    
    // 如果 props 属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }
    
    // 如果图片的旋转角度有值且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      ['-moz-', '-ms-', '-webkit-', ''].forEach(function(v) {
        styleObj[v + 'transform'] = 'rotateZ(' + this.props.arrange.rotate + 'deg)'
      }.bind(this));
    }
    
    if (this.props.arrange.isCenter) {
      styleObj['zIndex'] = 11
    }
    
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''
    
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
})

export default ImgFigure
