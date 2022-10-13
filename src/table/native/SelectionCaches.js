class SelectionCaches {
  constructor(selectionsAPI) {
    this.selectionsAPI = selectionsAPI;
  }

  async toggleSelected(value) {
    try {
      if (value.length > 0) {
        if (!this.selectionsAPI.isModal()) {
          await this.selectionsAPI.begin(['/qHyperCubeDef']);
        }
        const elms = new Set();
        const rows = new Set();
        value.forEach((e) => {
          const split = e.split('/');
          split.shift();
          rows.add(parseInt(split[2], 10));
          elms.add(parseInt(split[1], 10));
        });

        const params = ['/qHyperCubeDef', Array.from(rows), Array.from(elms)];
        const s = {
          method: 'selectHyperCubeCells',
          params,
        };

        this.selectionsAPI.select(s);
      } else if (this.selectionsAPI.isModal()) {
        await this.selectionsAPI.cancel();
      }
    } catch (error) {
      console.log('Error toggling selections', error);
    }
  }

  async confirm() {
    try {
      this.selectionsAPI.confirm();
    } catch (error) {
      console.log(error);
    }
  }
}

export default SelectionCaches;
