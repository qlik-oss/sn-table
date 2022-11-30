export default class DataCacheStream {
  constructor(manageData, qaeProps) {
    this.manageData = manageData;
    this.data = undefined;
    this.slice = [];
    this.dataPointer = { top: 0, bottom: 0, rows: [], size: { qcy: 0 } };
    this.qaeProps = qaeProps;
  }

  async invalidate(model, layout, pageInfo) {
    this.model = model;
    this.layout = layout;
    this.pageInfo = pageInfo;
    this.data = await this.manageData(model, layout, pageInfo, null, this.qaeProps);
    this.data.reset = true;
    return this.data;
  }

  async next() {
    this.pageInfo = { ...this.pageInfo, page: this.pageInfo.page + 1 };
    this.data = await this.manageData(this.model, this.layout, this.pageInfo, null, this.qaeProps);
    this.data.reset = false;
    return this.data;
  }
}
