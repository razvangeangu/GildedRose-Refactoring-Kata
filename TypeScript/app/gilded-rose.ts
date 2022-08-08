export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  private updateAgedBrie(item: Item) {
    let quality = 1;

    if (item.sellIn < 0) {
      quality = 2;
    }

    item.quality += quality;

    if (item.quality > 50) {
      item.quality = 50;
    }
  }

  private updateBackstagePass(item: Item) {
    let quality = 0;

    if (item.sellIn < 0) {
      item.quality = quality;
      return;
    }

    quality = 1;

    if (item.sellIn < 10) {
      quality = 2;
    }

    if (item.sellIn < 5) {
      quality = 3;
    }

    item.quality += quality;

    if (item.quality > 50) {
      item.quality = 50;
    }
  }

  private updateNormal(item: Item) {
    let quality = 1;

    if (item.sellIn < 0) {
      quality = 2;
    }

    if (item.quality - quality < 0) {
      quality = 0;
    }

    item.quality -= quality;
  }

  updateQuality() {
    this.items.forEach((item) => {
      item.sellIn -= 1;

      switch (item.name) {
        case AGED_BRIE:
          this.updateAgedBrie(item);
          break;

        case BACKSTAGE_PASS:
          this.updateBackstagePass(item);
          break;

        case SULFURAS:
          break;

        default:
          this.updateNormal(item);
          break;
      }
    });

    return this.items;
  }
}

const AGED_BRIE = "Aged Brie";
const BACKSTAGE_PASS = "Backstage passes to a TAFKAL80ETC concert";
const SULFURAS = "Sulfuras, Hand of Ragnaros";
