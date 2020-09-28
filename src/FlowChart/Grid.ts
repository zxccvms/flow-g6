import G6 from '@antv/g6';
import modifyCSS from '@antv/dom-util/lib/modify-css';

class Grid extends G6.Grid {
  /**
   * viewport change 事件的响应函数
   * @param param
   */
  protected updateGrid(param) {
    const gridContainer: HTMLDivElement = this.get('gridContainer');
    let { matrix } = param;
    if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    const transform = `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[3]}, ${matrix[4]}, ${matrix[6] + 4000 * matrix[0]}, ${matrix[7] + 4000 * matrix[0]})`;

    modifyCSS(gridContainer, {
      transform,
    });
  }
}

export default Grid